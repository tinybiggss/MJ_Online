# Page Creation Workflow - Questions to Answer

**Date:** 2026-02-06
**Context:** Transitioning from browser automation to API-based publishing workflow
**Status:** Questions captured for future decision-making

---

## Workflow Overview (Proposed)

**New Process:**
1. **Debbie** (Design System Architect) → Designs pages using approved design system
2. **Mobiledoc Assembler** (New Agent) → Converts design specs to valid Mobiledoc JSON
3. **Alice** (Publisher) → Publishes content via Ghost Admin API

**Goal:** Eliminate browser automation challenges, create repeatable process, ensure design consistency

---

## Questions to Answer Before Full Implementation

### 1. Debbie's Design Output Format

**Question:** What format should Debbie use to communicate her designs to the Mobiledoc Assembler?

**Options:**
- Written specifications (structure, content blocks, styling)?
- HTML mockups?
- Markdown with annotations?
- Something else?

**Morgan's Initial Recommendation:**
Detailed written specifications in the design system, then for each page:
- Markdown structure with annotations
- Image placement notes (which assets, where, what size)
- Content block descriptions
- Typography/spacing specifications from design system

**Decision:** [To be determined during pilot test]

---

### 2. Image Handling

**Question:** Images need to be uploaded via API before they can be referenced in Mobiledoc. Who handles this and when?

**Options:**
- Alice uploads images first, then Mobiledoc Assembler references them?
- Mobiledoc Assembler requests image uploads as part of their output?
- Separate image upload step before Mobiledoc creation?

**Morgan's Initial Recommendation:**
Process:
1. Debbie specifies which images go where
2. Alice uploads images via Ghost API → gets URLs back
3. Mobiledoc Assembler includes those URLs in the JSON
4. Alice publishes the complete Mobiledoc

**Decision:** [To be determined during pilot test]

---

### 3. RAG Fact Verification

**Question:** Currently Debbie verifies facts against RAG. In the new workflow, when and who verifies?

**Options:**
- Debbie verifies during design phase?
- Alice verifies before publishing?
- Verification happens before or after Mobiledoc creation?

**Morgan's Initial Recommendation:**
Debbie verifies during design phase (she's already doing this). Alice does final verification before publishing. Double-check = quality assurance.

**Decision:** [To be determined during pilot test]

---

### 4. Existing Pages

**Question:** What about the 3 pages Debbie already completed (Contact, Homepage, Projects Landing)?

**Options:**
- Leave as-is?
- Redo with new process for consistency?
- Document as "legacy" and move forward with new pages only?

**Morgan's Initial Recommendation:**
Leave the 3 completed pages as-is for now. Apply the new process to:
- About (next in queue)
- Resume (after Mike fixes factual errors)
- Both case studies (image additions)

This way we test the new workflow on pages that still need work.

**Decision:** [To be determined]

---

### 5. Review/Verification Step

**Question:** After Alice publishes, how do we verify it matches Debbie's design intent?

**Options:**
- Visual review by Mike?
- Debbie reviews published output?
- Automated validation?

**Morgan's Initial Recommendation:**
Visual review by Mike makes most sense. After Alice publishes via API, Mike reviews the live page and provides feedback. Debbie can iterate if needed.

**Decision:** [To be determined]

---

## Additional Considerations

### Pilot Test Approach

**Recommended:**
- Pick one page for pilot test (About page is good candidate)
- Run through complete workflow: Design → Mobiledoc → Publish
- Document what works, what doesn't
- Iterate on process before rolling out to all remaining pages

### Success Criteria for Pilot

- [ ] Design specs clearly communicate intent to Mobiledoc Assembler
- [ ] Mobiledoc JSON is valid and renders correctly in Ghost
- [ ] Images upload and display properly
- [ ] Published page matches design intent
- [ ] Process is faster/more reliable than browser automation
- [ ] Process is repeatable for future pages

### Rollout Strategy

**After successful pilot:**
1. Document refined workflow
2. Update all agent instructions
3. Apply to remaining pages:
   - Resume (after Mike's fixes)
   - NeighborhoodShare case study (add images)
   - Local LLM case study (add images)
4. Use for all future page creation

---

## Next Steps

1. Complete Design System (`/design/DESIGN-SYSTEM.md`) - Debbie
2. Create Mobiledoc Assembler agent - PM/designated agent
3. Run pilot test on About page
4. Review pilot results, answer workflow questions above
5. Refine process based on learnings
6. Roll out to remaining pages

---

**Last Updated:** 2026-02-06
**Owner:** Morgan (Project Manager)
**Status:** Questions captured, awaiting pilot test to answer
