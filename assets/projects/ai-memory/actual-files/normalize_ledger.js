#!/usr/bin/env node
// Memory ledger normalization script
const fs = require('fs');
const path = require('path');

// Pacific Time conversion function
function toPacificISO(timestamp) {
    if (!timestamp) {
        const now = new Date();
        const options = { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const pacificTime = now.toLocaleString('en-CA', options).replace(', ', 'T');
        const isDST = now.getTimezoneOffset() !== new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
        return pacificTime + (isDST ? '-07:00' : '-08:00');
    }
    
    try {
        const date = new Date(timestamp);
        const options = { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const pacificTime = date.toLocaleString('en-CA', options).replace(', ', 'T');
        
        // Simple DST check
        const year = date.getFullYear();
        const dstStart = new Date(year, 2, 14 - (new Date(year, 2, 1).getDay() + 6) % 7);
        const dstEnd = new Date(year, 10, 7 - (new Date(year, 10, 1).getDay() + 6) % 7);
        const isDST = date >= dstStart && date < dstEnd;
        
        return pacificTime + (isDST ? '-07:00' : '-08:00');
    } catch (error) {
        console.log(`Error parsing timestamp: ${timestamp}`);
        return toPacificISO();
    }
}

// Stable ID generator
function stableId(entry) {
    const base = [
        entry.timestamp || '',
        entry.type || '',
        entry.summary || '',
        (entry.tags || []).sort().join(',')
    ].join('|');
    
    let hash = 0;
    for (let i = 0; i < base.length; i++) {
        const char = base.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'mem-' + Math.abs(hash).toString(16).padStart(12, '0').substring(0, 12);
}

// Normalization function
function normalize(raw) {
    const e = { ...raw };
    
    // Handle timestamp aliases and convert to Pacific
    if (!e.timestamp && e.ts) {
        e.timestamp = e.ts;
        delete e.ts;
    }
    e.timestamp = toPacificISO(e.timestamp);
    
    // Projects/author defaults
    if (!e.projects || !Array.isArray(e.projects) || e.projects.length === 0) {
        e.projects = ["OfflineAI"];
    }
    e.author = e.author || "Mike";
    
    // Topic -> tags migration
    let tags = Array.isArray(e.tags) ? [...e.tags] : (e.tags ? [String(e.tags)] : []);
    if (e.topic) {
        tags.push(String(e.topic));
        delete e.topic;
    }
    e.tags = [...new Set(tags.filter(t => t))].sort();
    
    // Array fields
    e.related_files = Array.isArray(e.related_files) ? e.related_files : (e.related_files ? [e.related_files] : []);
    e.links = Array.isArray(e.links) ? e.links : (e.links ? [e.links] : []);
    
    // Required fields
    e.type = e.type || "note";
    e.summary = (e.summary || "").trim();
    e.details = (e.details || "").trim();
    e.source = e.source || "claude";
    e.source_convo = e.source_convo || "";
    
    // Generate ID if missing
    e.id = e.id || stableId(e);
    
    return e;
}

// Merge function for duplicates
function merge(a, b) {
    const a_ts = a.timestamp;
    const b_ts = b.timestamp;
    const keepEarliest = a_ts <= b_ts ? a : b;
    const other = keepEarliest === a ? b : a;
    const out = { ...keepEarliest };
    
    // Union arrays
    out.projects = [...new Set([...a.projects, ...b.projects])].sort();
    out.tags = [...new Set([...a.tags, ...b.tags])].sort();
    out.links = [...new Set([...a.links, ...b.links])].sort();
    out.related_files = [...new Set([...a.related_files, ...b.related_files])].sort();
    
    // Prefer non-empty values
    out.author = a.author || b.author || "Mike";
    out.source_convo = a.source_convo || b.source_convo || "";
    out.source = a.source || b.source || "claude";
    out.type = a.type || b.type || "note";
    out.summary = a.summary || b.summary || "";
    
    // Keep longer details
    out.details = a.details.length > b.details.length ? a.details : b.details;
    
    // Keep existing mem- ID
    out.id = (a.id && a.id.startsWith('mem-')) ? a.id : 
             (b.id && b.id.startsWith('mem-')) ? b.id : 
             stableId(out);
    
    return out;
}

// Main processing function
function processLedger() {
    const memoryPath = '/Volumes/MacMini_Extended/rt-assistant/knowledge/memory/memory.jsonl';
    const chatgptPath = '/Volumes/MacMini_Extended/rt-assistant/knowledge/ChatGPT/rt_memory_session_2025-09-18_v1.jsonl';
    
    console.log('Reading files...');
    
    // Read all entries
    const allEntries = [];
    
    // Read memory entries
    if (fs.existsSync(memoryPath)) {
        const memoryContent = fs.readFileSync(memoryPath, 'utf8');
        const memoryLines = memoryContent.trim().split('\n').filter(line => line.trim());
        memoryLines.forEach((line, i) => {
            try {
                allEntries.push(JSON.parse(line));
            } catch (e) {
                console.log(`Error parsing memory line ${i + 1}: ${e.message}`);
            }
        });
        console.log(`Loaded ${memoryLines.length} memory entries`);
    }
    
    // Read ChatGPT entries
    if (fs.existsSync(chatgptPath)) {
        const chatgptContent = fs.readFileSync(chatgptPath, 'utf8');
        const chatgptLines = chatgptContent.trim().split('\n').filter(line => line.trim());
        chatgptLines.forEach((line, i) => {
            try {
                const entry = JSON.parse(line);
                entry.source = 'chatgpt'; // Mark source
                allEntries.push(entry);
            } catch (e) {
                console.log(`Error parsing ChatGPT line ${i + 1}: ${e.message}`);
            }
        });
        console.log(`Loaded ${chatgptLines.length} ChatGPT entries`);
    }
    
    console.log(`Total entries to process: ${allEntries.length}`);
    
    // Normalize all entries
    console.log('Normalizing entries...');
    const normalized = allEntries.map(entry => normalize(entry));
    
    // Deduplicate by ID
    console.log('Deduplicating...');
    const byId = {};
    normalized.forEach(entry => {
        const id = entry.id;
        if (byId[id]) {
            byId[id] = merge(byId[id], entry);
        } else {
            byId[id] = entry;
        }
    });
    
    // Sort by timestamp
    const final = Object.values(byId).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    
    console.log(`Final count: ${final.length} unique entries`);
    
    // Create backup
    const backupPath = memoryPath + '.bak';
    if (fs.existsSync(memoryPath)) {
        fs.copyFileSync(memoryPath, backupPath);
        console.log(`Created backup: ${backupPath}`);
    }
    
    // Write normalized file
    const outputLines = final.map(entry => JSON.stringify(entry));
    fs.writeFileSync(memoryPath, outputLines.join('\n') + '\n');
    
    console.log(`Wrote normalized ledger: ${memoryPath}`);
    console.log(`Stats: ${allEntries.length} input -> ${final.length} final`);
    
    // Show sample entries
    console.log('\nFirst 2 normalized entries:');
    final.slice(0, 2).forEach(entry => {
        console.log(JSON.stringify(entry, null, 2));
        console.log('---');
    });
}

// Run the processing
if (require.main === module) {
    processLedger();
}

module.exports = { normalize, merge, toPacificISO, stableId };
