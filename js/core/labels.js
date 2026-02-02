/**
 * PROJECT DIRECTORY & TEXT LABELS
 * This file serves as the Single Source of Truth for all UI text.
 * Use the map below to find the logic file associated with each text group.
 * * --- DIRECTORY MAPPING ---
 * * TXT.CORE                     -> js/core/ (utils.js, config.js, api.js)
 * * TXT.COMPONENTS.FAB           -> js/components/fab.js
 * * TXT.COMPONENTS.MODALS
 * .PLAN                     -> js/components/modals/plan.js
 * .REVIEW                   -> js/components/modals/review.js
 * * TXT.COMPONENTS.MODALS.OBSERVATION
 * .WIZARD                   -> js/components/modals/observation/wizard.js
 * .GENERAL                  -> js/components/modals/observation/general.js
 * .FOCUSED                  -> js/components/modals/observation/focused.js
 * .PROGRESS                 -> js/components/modals/observation/progress.js
 * * TXT.VIEWS.FEED               -> js/views/feed/base.js
 * .FILTERS                  -> (Used in index.html filter bar)
 * .ACTIVITY                 -> js/views/feed/activity_tile.js
 * .REPORT                   -> js/views/feed/report_tile.js
 * .OBSERVATION              -> js/views/feed/observation_tile.js
 * .PROGRESS                 -> js/views/feed/progress_tile.js
 * .INSIGHT                  -> js/views/feed/insight_tile.js
 * * TXT.VIEWS.ACTIVITY_DETAIL    -> js/views/activity.js
 * TXT.VIEWS.PROGRESS_DASHBOARD -> js/views/progress.js
 * * -------------------------
 */

const TXT = {
    
    // --- JS/CORE ---
    CORE: {
        APP_TITLE: "Baby Bloom",
        LOADING: "Loading...",
        ERROR_NETWORK: "Connection failed. Please check internet.",
        ERROR_NO_CHILDREN: "No children found associated with this ID.",
        LOGOUT: "Switch Profile",
        
        // Mastery Levels (Used by Utils)
        SCORES: {
            0: "Unattempted",
            1: "Introduced",
            2: "Assisted",
            3: "Guided",
            4: "Independent"
        },
        
        // Default fallbacks
        UNKNOWN_DOMAIN: "General",
        UNKNOWN_SKILL: "Unknown Skill"
    },

    // --- JS/COMPONENTS ---
    COMPONENTS: {
        
        // js/components/fab.js
        FAB: {
            PLAN: "Activity",
            OBSERVATION: "Observation"
        },

        // js/components/modals/
        MODALS: {
            
            // js/components/modals/plan.js
            PLAN: {
                HEADER: "Plan Activity",
                SUBHEADER: "Select up to 3 objectives",
                SECTION_TITLE: "Browse Areas",
                MAX_LIMIT_TITLE: "Ready to Generate!",
                MAX_LIMIT_MSG: "You have selected the maximum of 3 objectives.",
                BTN_SUBMIT: "Create Activity",
                BTN_PROCESSING: "Processing..."
            },

            // js/components/modals/review.js
            REVIEW: {
                HEADER: "Activity Report",
                SUBHEADER: "Rate the child's performance",
                SECTION_NOTES: "Notes",
                PLACEHOLDER_NOTES: "How did it go?",
                BTN_SUBMIT: "Submit Report",
                BTN_SUBMITTING: "Submitting...",
                ERROR_NO_SELECTION: "Please select a mastery level for at least one skill."
            },

            // js/components/modals/observation/
            OBSERVATION: {
                
                // js/components/modals/observation/wizard.js
                WIZARD: {
                    HEADER_NEW: "New Observation",
                    HEADER_GENERAL: "General Entry",
                    HEADER_FOCUSED: "Focused Entry",
                    HEADER_PROGRESS: "Update Progress",
                    
                    // Step 1 Buttons
                    BTN_GENERAL_TITLE: "General",
                    BTN_GENERAL_DESC: "Daily update, mood, or activity.",
                    
                    BTN_FOCUSED_TITLE: "Focused",
                    BTN_FOCUSED_DESC: "Link to Areas of Development.",
                    
                    BTN_PROGRESS_TITLE: "Progress",
                    BTN_PROGRESS_DESC: "Detailed skills assessment."
                },

                // js/components/modals/observation/general.js
                GENERAL: {
                    BADGE: "General",
                    PLACEHOLDER: "Write Observation...",
                    BTN_SAVE: "Save Observation"
                },

                // js/components/modals/observation/focused.js
                FOCUSED: {
                    LABEL_SELECT: "Add Area",
                    LABEL_INPUT: "Observation",
                    PLACEHOLDER: "Details...",
                    HINT: "Select an Area above to start.",
                    BTN_SAVE: "Save Observation"
                },

                // js/components/modals/observation/progress.js
                PROGRESS: {
                    // Note: Accordion headers come from Config/Library
                    BTN_ADD_PROGRESS: "Add Progress",
                    
                    // Note Step
                    BADGE_UPDATE: "Progress Update",
                    BTN_SKIP: "Skip Note",
                    PLACEHOLDER: "Add optional observation...",
                    BTN_SAVE: "Add Observation",
                    
                    ERROR_NO_SELECTION: "Select at least one milestone."
                },
                
                // Shared across observation actions
                SUCCESS_MSG: "Added!"
            }
        }
    },

    // --- JS/VIEWS ---
    VIEWS: {
        
        // js/views/feed/
        FEED: {
            EMPTY: "No history yet. Start by planning an activity!",
            LOADING: "Loading timeline...",
            
            // New Filter Bar Labels
            FILTERS: {
                ALL: "All",
                OBS: "Obs",
                GROWTH: "Growth",
                INSIGHTS: "Insights"
            },
            
            // js/views/feed/activity_tile.js
            ACTIVITY: {
                BADGE_PENDING: "Generating...",
                TITLE_PENDING: "Planning Activity...",
                BADGE_PLAN: "Activity Plan",
                BADGE_COMPLETED: "Completed",
                BTN_VIEW: "View Activity"
            },
            
            // js/views/feed/report_tile.js
            REPORT: {
                BADGE: "Activity Completed",
                LABEL_PROGRESS: "Progress Update",
                BTN_LINK: "View Activity Details"
            },
            
            // js/views/feed/observation_tile.js
            OBSERVATION: {
                BADGE: "Observation",
                BADGE_ACHIEVED: "Achieved"
            },
            
            // js/views/feed/progress_tile.js
            PROGRESS: {
                BADGE: "Growth"
            },
            
            // js/views/feed/insight_tile.js
            INSIGHT: {
                BADGE: "AI Insight"
            }
        },

        // js/views/activity.js
        ACTIVITY_DETAIL: {
            DEFAULT_TITLE: "Activity Detail",
            
            // Accordion Headers
            SECTION_OBJECTIVES: "Objectives",
            SECTION_INTENTION: "Intention",
            SECTION_SUPPLIES: "You Will Need",
            SECTION_GUIDE: "Step-by-Step",
            SECTION_TIPS: "Encouragement",
            SECTION_OBSERVATIONS: "What to Look For",
            
            // Inner Labels
            LABEL_NEW: "New",
            LABEL_MASTERED: "Mastered",
            
            BTN_COMPLETE: "Complete & Report"
        },
        
        // js/views/progress.js
        PROGRESS_DASHBOARD: {
            HEADER_CHART: "Progress Dashboard",
            BADGE_LIVE: "Live"
        }
    }
};
