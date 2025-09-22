<!-- prompts.md -->

## CONTEXT_LOADING_PROMPT
"Before we begin, please read these project files:
1. README.md (architecture overview)
2. TODO.md (current phase & tasks)
3. CONTRIBUTING.md (coding standards)

Current phase: [MANUAL_UPDATE_NEEDED]
Context: I'm working on [SPECIFIC_TASK]"

## DEBUGGING_PROMPT
"I'm experiencing [ISSUE]. Please:
1. Check TROUBLESHOOTING.md for similar issues
2. Provide solution following our standards from CONTRIBUTING.md
3. Reference architecture from README.md if needed"

## FEATURE_DEVELOPMENT_PROMPT
"I want to implement [FEATURE]. Please:
1. Confirm this aligns with roadmap in HIGH_LEVEL_ROADMAP.md
2. Check current phase tasks in TODO.md
3. Follow architecture from README.md
4. Ensure code quality matches CONTRIBUTING.md"

## CODE_REVIEW_PROMPT
"Please review this code against our standards:
1. Check coding standards from CONTRIBUTING.md
2. Ensure PR requirements from PR_TEMPLATE.md are met
3. Verify alignment with architecture in README.md"
