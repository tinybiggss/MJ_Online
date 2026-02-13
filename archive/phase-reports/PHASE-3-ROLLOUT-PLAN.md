# Phase 3 Rollout Plan - Validated Workflow

**Status:** Phase 3.0.3 pilot test COMPLETE and SUCCESSFUL ✅
**Date:** 2026-02-09
**Coordinator:** Morgan (Project Manager)

---

## Workflow Validation Results

### Phase 3.0.3: About Page - COMPLETE

**Live Page:** https://www.mikejones.online/about/

**User Feedback:** "This page is so much better!" - Mike Jones

**Technical Validation:**
- ✅ Design System → PAGE_SPEC workflow works
- ✅ HTML generation (Doc Brown) precise and reliable
- ✅ Ghost API publishing with `source=html` parameter successful
- ✅ Ghost automatically converts HTML → Lexical format
- ✅ No browser automation needed (faster, more reliable)
- ✅ NATS agent coordination effective
- ✅ Quality significantly improved vs. old approach

**Critical Discovery:** Ghost 5.x uses Lexical format, not Mobiledoc. HTML with `source=html` parameter is the correct approach. Simpler than creating Lexical JSON directly.

---

## Validated Workflow

```
┌─────────┐      ┌───────┐      ┌───────────┐      ┌───────┐
│ Debbie  │─────▶│ Alice │─────▶│ Doc Brown │─────▶│ Alice │
└─────────┘      └───────┘      └───────────┘      └───────┘
    │                │                 │                │
    │                │                 │                │
    ▼                ▼                 ▼                ▼
PAGE_SPEC        Upload           Generate          Publish
(25KB for      Images to           Clean          to Ghost
 About)        Ghost API         Semantic           with
                 (get URLs)         HTML         source=html
                                                 parameter
```

**Handoff Points:**
1. Debbie → Alice: PAGE_SPEC file in `/design/`
2. Alice → Doc Brown: Image URLs in handoff document
3. Doc Brown → Alice: HTML file in `/content-drafts/`
4. Alice → Live: Published page via Ghost Admin API

---

## Ready for Rollout: Remaining Pages

### Phase 3.0.4: Resume Page

**Estimated Time:** 3-4 hours

**Inputs Required:**
- RAG verification: Job titles, dates, experience years (29 years)
- Professional achievements and metrics
- Skills and technologies
- Education

**Workflow:**
1. Debbie creates PAGE_SPEC for Resume (following design system)
2. Alice uploads any needed images (professional headshot already uploaded)
3. Doc Brown converts PAGE_SPEC → HTML
4. Alice publishes with `source=html` parameter
5. ✅ Live Resume page

**Expected Outcome:** Professional CV page showcasing Mike's 29-year career

---

### Phase 3.0.5: Projects Landing Page

**Estimated Time:** 3-4 hours

**Inputs Required:**
- List of featured projects (NeighborhoodShare, Local LLM, AI Memory System, etc.)
- Project summaries and links
- Project thumbnails/screenshots

**Workflow:**
1. Debbie creates PAGE_SPEC for Projects landing
2. Alice uploads project thumbnails to Ghost
3. Doc Brown converts PAGE_SPEC → HTML
4. Alice publishes with `source=html` parameter
5. ✅ Live Projects landing page

**Expected Outcome:** Clean project showcase with links to case studies

---

### Phase 3.0.6: Homepage

**Estimated Time:** 4-5 hours (most complex page)

**Inputs Required:**
- Hero section content (professional title, tagline)
- Featured projects/case studies
- Call-to-action buttons
- Navigation to key pages

**Workflow:**
1. Debbie creates PAGE_SPEC for Homepage (most detailed)
2. Alice uploads hero images/graphics if needed
3. Doc Brown converts PAGE_SPEC → HTML
4. Alice publishes with `source=html` parameter
5. ✅ Live Homepage

**Expected Outcome:** Professional landing page that positions Mike as "AI Implementation Expert and LLM Integration Specialist"

---

### Case Study Image Enhancements

**NeighborhoodShare Case Study**
- Status: Published (text-only)
- Images Available: 19 screenshots + 2 logos in `/assets/projects/neighborhoodshare/`
- Estimated Time: 1-2 hours
- Workflow: Alice uploads images → Updates page via Ghost API

**Local LLM Case Study**
- Status: Published (text-only)
- Images Available: TBD - check for screenshots
- Estimated Time: 1-2 hours
- Workflow: Alice uploads images → Updates page via Ghost API

---

## Execution Strategy

### Option 1: Sequential Rollout (Recommended)

**Week 1 (Current):**
- ✅ Phase 3.0.3: About page (COMPLETE)
- ⏳ Phase 3.0.4: Resume page
- ⏳ Phase 3.0.5: Projects landing page

**Week 2:**
- ⏳ Phase 3.0.6: Homepage (save most important for last)
- ⏳ Case study image enhancements (NeighborhoodShare + Local LLM)

**Advantages:**
- Validates workflow on each page
- Catches any issues early
- Allows iteration and improvement
- Builds momentum

---

### Option 2: Parallel Execution

Launch multiple pages simultaneously (Debbie creates all PAGE_SPECs, then Doc Brown processes all, then Alice publishes all)

**Advantages:**
- Faster completion
- Efficient batching

**Disadvantages:**
- Higher coordination overhead
- Less flexibility for iteration
- All-or-nothing approach

**Recommendation:** Sequential for now. Workflow is new and we want to ensure quality on each page.

---

## Success Criteria

Each page rollout is successful when:

- ✅ PAGE_SPEC created by Debbie (follows design system)
- ✅ Images uploaded to Ghost by Alice (if needed)
- ✅ HTML generated by Doc Brown (semantic, valid)
- ✅ Page published via Ghost API with `source=html`
- ✅ Ghost converts HTML → Lexical automatically
- ✅ Page accessible and content correct
- ✅ Mobile responsive
- ✅ RAG-verified facts (where applicable)
- ✅ Design system consistency maintained

---

## Quality Assurance

After each page is published:

1. **Visual Review:** Check design matches intent
2. **Content Verification:** Verify facts against RAG
3. **Responsive Testing:** Check mobile/tablet/desktop
4. **Link Testing:** Verify all links work
5. **SEO Check:** Meta title, description, social preview
6. **User Approval:** Mike reviews and approves

---

## Risk Mitigation

**Potential Risks:**
1. Format issues (like Mobiledoc/Lexical) → MITIGATED: HTML with source=html proven
2. Image URL problems → MITIGATED: Alice uploads to Ghost first
3. Content accuracy → MITIGATED: RAG verification
4. Design consistency → MITIGATED: Design system established

**Backup Plan:**
If HTML workflow fails for any page:
1. Diagnose issue via Ghost API response
2. Check HTML validity
3. Verify source=html parameter included
4. Test with minimal HTML first
5. Escalate to Morgan for research/troubleshooting

---

## Agent Assignments

**Debbie (Web-Design-Agent):**
- Create PAGE_SPEC for each page
- Follow design system
- RAG verification
- Visual hierarchy and pacing

**Alice (Web-Content-Builder):**
- Upload images to Ghost API
- Publish HTML via Ghost API with `source=html`
- SEO metadata
- Verification and testing

**Doc Brown (HTML Assembler):**
- Convert PAGE_SPEC → semantic HTML
- Follow allowed HTML elements
- Maintain quality standards
- No interpretation beyond structural translation

**Morgan (Project Manager):**
- Coordinate workflow handoffs
- Monitor progress
- Update roadmap and PROJECT-MEMORY.json
- Resolve blockers
- Maintain NATS coordination

---

## Communication Protocol

**NATS Channels:**
- `mjwork.coordination` - Agent-to-agent coordination
- `mjwork.tasks.available` - Task queue (if used)
- `mjwork.tasks.completed` - Completion notifications
- `mjwork.heartbeat.{agentId}` - Agent health monitoring

**Handoff Documents:**
- Each workflow step creates handoff document
- File paths clearly documented
- Quality checklists included
- Coordination messages sent via NATS

---

## Documentation Updates

After each page completion:

1. **PROJECT-MEMORY.json:** Add task completion entry
2. **Roadmap:** Update phase status
3. **Agent Memory Files:** Update individual agent memories
4. **Completion Reports:** Create summary documents (like PHASE-3.0.3-COMPLETION-REPORT.md)

---

## Launch Readiness Checklist

Phase 3 is complete when:

- ✅ About page published (COMPLETE)
- ⏳ Resume page published
- ⏳ Projects landing page published
- ⏳ Homepage published
- ⏳ NeighborhoodShare case study enhanced with images
- ⏳ Local LLM case study enhanced with images
- ⏳ All pages mobile responsive
- ⏳ All links working
- ⏳ SEO metadata complete
- ⏳ Mike's final approval

**When Phase 3 complete:** Move to Phase 4 (Testing & Refinement)

---

## Next Steps

**Immediate (Today/Tomorrow):**
1. Mike decides: Resume page OR Projects page next?
2. Launch Debbie to create PAGE_SPEC
3. Continue validated workflow
4. Build momentum toward launch

**This Week:**
- Complete 2-3 more pages using validated workflow
- Maintain quality standards
- Document any learnings or refinements

**Next Week:**
- Complete remaining pages
- Add case study images
- Final testing and refinement
- Prepare for launch

---

## Key Learnings from Phase 3.0.3

1. **HTML simpler than JSON formats** - Ghost handles conversion
2. **Pilot testing essential** - Caught format issue before affecting all pages
3. **source=html parameter is correct** - Future-proof with Ghost 5.x
4. **Design system works** - Creates consistent, professional results
5. **Agent coordination effective** - NATS system proving valuable
6. **User feedback valuable** - "This page is so much better!" validates approach

---

**Ready to roll out!** 🚀

Workflow validated, agents updated, documentation complete. Each page should follow this proven process for quality and reliability.

---

*Morgan (Project Manager)*
*2026-02-09*
