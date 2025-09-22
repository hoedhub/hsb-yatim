<!-- 
🎯 PR Template - Aplikasi Tiket Jahit
Please fill out this template to help reviewers understand your changes
Delete sections that don't apply to your PR
-->

## 📋 PR Summary

**Ticket/Issue:** [TJ-XXX](link-to-ticket)

**Type of Change:**
- [ ] 🆕 New feature
- [ ] 🐛 Bug fix  
- [ ] 🔄 Refactor (no functionality change)
- [ ] 📚 Documentation update
- [ ] ⚡ Performance improvement
- [ ] 🔧 Chore (dependencies, build, etc.)

**Brief Description:**
<!-- Describe what this PR does in 1-2 sentences -->

---

## 🎯 Changes Made

### Features Added
- [ ] Feature 1: Description
- [ ] Feature 2: Description

### Bug Fixes
- [ ] Bug 1: Description and root cause
- [ ] Bug 2: Description and root cause

### Technical Changes
- [ ] Database schema changes
- [ ] API changes
- [ ] Configuration changes
- [ ] Dependency updates

---

## 🧪 Testing Checklist

### Automated Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] E2E tests pass (for UI changes)
- [ ] All existing tests still pass

### Manual Testing
- [ ] Feature tested in development environment
- [ ] Edge cases tested
- [ ] Error scenarios tested
- [ ] Mobile/responsive testing (for UI changes)
- [ ] Print functionality tested (if applicable)

### Browser Compatibility (if applicable)
- [ ] Chrome
- [ ] Firefox  
- [ ] Safari
- [ ] Edge

---

## 📊 Code Quality

### Code Review Checklist
- [ ] Code follows project style guide
- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] No hardcoded values (use environment variables)
- [ ] No console.log or debug code left behind

### Documentation
- [ ] Code comments added for complex logic
- [ ] README updated (if needed)
- [ ] API documentation updated (if applicable)
- [ ] Component documentation updated (if applicable)

---

## 📸 Visual Changes (if applicable)

### Screenshots/Videos
<!-- Add screenshots for UI changes -->
<!-- Use GIFs or videos for complex interactions -->

**Before:**
<!-- Screenshot of current state -->

**After:**  
<!-- Screenshot of new state -->

### UI/UX Impact
- [ ] Responsive design maintained
- [ ] Accessibility considerations addressed
- [ ] Print layouts unaffected (or intentionally changed)
- [ ] Loading states implemented
- [ ] Error states handled

---

## 🗄️ Database Changes

### Schema Changes
- [ ] Migration scripts created
- [ ] Migration tested locally
- [ ] Rollback procedure documented
- [ ] No breaking changes to existing data

### Migration Details
<!-- If database changes are involved -->
```sql
-- Example migration SQL
ALTER TABLE order ADD COLUMN tracking_code TEXT;
```

**Rollback Plan:**
```sql
-- Rollback SQL if needed
ALTER TABLE order DROP COLUMN tracking_code;
```

---

## ⚠️ Breaking Changes

### API Breaking Changes
- [ ] No breaking changes
- [ ] Breaking changes documented below

<!-- If breaking changes exist, describe them -->
**Breaking Changes:**
- Change 1: Description and migration path
- Change 2: Description and migration path

### Migration Guide
<!-- Instructions for upgrading from previous version -->
```bash
# Steps to migrate existing installations
pnpm db:migrate
# Update environment variables if needed
```

---

## 🔒 Security Considerations

- [ ] No sensitive data exposed in logs
- [ ] Input validation added/maintained
- [ ] Authentication/authorization respected  
- [ ] No new security vulnerabilities introduced
- [ ] SQL injection prevention maintained
- [ ] XSS prevention maintained

**Security Notes:**
<!-- Any specific security considerations for this change -->

---

## ⚡ Performance Impact

### Performance Considerations
- [ ] No significant performance impact
- [ ] Performance impact assessed and acceptable
- [ ] Performance improvements included

### Metrics (if applicable)
<!-- Before/after performance metrics -->
- Bundle size: Before XXkB → After XXkB
- Load time: Before XXms → After XXms
- Database query time: Before XXms → After XXms

---

## 📝 Additional Notes

### Dependencies
- [ ] No new dependencies added
- [ ] New dependencies justified and documented

**New Dependencies:**
<!-- List any new packages added -->
- `package-name@version`: Reason for adding

### Configuration Changes
- [ ] No environment variable changes
- [ ] New environment variables documented

**New Environment Variables:**
```env
NEW_VAR="description of what this does"
```

### Deployment Notes
<!-- Special deployment considerations -->
- [ ] No special deployment requirements
- [ ] Special deployment steps documented below

**Deployment Steps:**
1. Step 1
2. Step 2

---

## 🎯 Review Focus Areas

**Please pay special attention to:**
- [ ] Database query performance in `src/routes/orders/+page.server.ts`
- [ ] Error handling in the new authentication flow
- [ ] Print CSS compatibility across browsers
- [ ] Form validation edge cases

**Questions for Reviewers:**
- Question 1: Should we handle X scenario differently?
- Question 2: Is the new API design intuitive?

---

## ✅ Pre-merge Checklist

### Author Responsibilities
- [ ] Self-review completed
- [ ] All automated checks passing
- [ ] Conflict resolution completed (if applicable)
- [ ] Ready for reviewer assignment

### Required Approvals
- [ ] Code review approval (minimum 2 reviewers)
- [ ] Design review approval (if UI changes)
- [ ] Security review approval (if security-related)
- [ ] Tech lead approval (if architectural changes)

### Merge Requirements
- [ ] All CI checks passing
- [ ] No merge conflicts
- [ ] Target branch is up to date
- [ ] Squash and merge strategy confirmed

---

## 🔗 Related Links

- **Ticket/Issue:** [TJ-XXX](link)
- **Design Mockups:** [Link to Figma/designs](link)
- **Related PRs:** [#123](link), [#124](link)
- **Documentation:** [Link to relevant docs](link)

---

## 🚀 Post-Merge Tasks

- [ ] Deploy to staging for testing
- [ ] Update project status in ticket tracker
- [ ] Notify stakeholders of completion
- [ ] Monitor production metrics after deployment
- [ ] Update changelog (if applicable)

---

<!-- 
📋 Reviewer Instructions:

1. Check that all checkboxes are properly filled
2. Verify testing has been completed
3. Review code quality and security
4. Test critical functionality if possible
5. Approve when satisfied with changes

🚨 Do not merge if:
- Tests are failing
- Breaking changes aren't properly documented
- Security concerns haven't been addressed
- Performance regressions are significant
-->

**Ready for Review:** @reviewer1 @reviewer2