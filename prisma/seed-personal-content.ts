import { PrismaClient } from '@prisma/client';
import { codingVariablesTypesContent } from '../src/content/personal/coding-variables-types';
import { codingFunctionsParametersContent } from '../src/content/personal/coding-functions-parameters';
import { codingLoopsControlFlowContent } from '../src/content/personal/coding-loops-control-flow';
import { codingArraysObjectsContent } from '../src/content/personal/coding-arrays-objects';
import { codingAsyncPromisesContent } from '../src/content/personal/coding-async-promises';
import { codingOperatorsExpressionsContent } from '../src/content/personal/coding-operators-expressions';
import { codingStringsMethodsContent } from '../src/content/personal/coding-strings-methods';
import { codingErrorHandlingContent } from '../src/content/personal/coding-error-handling';
import { codingReactFundamentalsContent } from '../src/content/personal/coding-react-fundamentals';
import { codingNextjsArchitectureDecisionTreeContent } from '../src/content/personal/coding-nextjs-architecture-decision-tree';
import { codingDomManipulationContent } from '../src/content/personal/coding-dom-manipulation';
import { codingClassesOopContent } from '../src/content/personal/coding-classes-oop';
import { codingModulesImportsContent } from '../src/content/personal/coding-modules-imports';
import { codingWorkingWithApisContent } from '../src/content/personal/coding-working-with-apis';
import { codingTypescriptDeepDiveContent } from '../src/content/personal/coding-typescript-deep-dive';
import { codingArrayMethodMasteryContent } from '../src/content/personal/coding-array-method-mastery';
import { codingDebuggingDevtoolsContent } from '../src/content/personal/coding-debugging-devtools';
import { codingJsTsInterviewPrepContent } from '../src/content/personal/coding-js-ts-interview-prep';
import { codingGitPrCommunicationContent } from '../src/content/personal/coding-git-pr-communication';
import { codingTestingFundamentalsConfidenceContent } from '../src/content/personal/coding-testing-fundamentals-confidence';
import { codingApiContractPrismaWorkflowContent } from '../src/content/personal/coding-api-contract-prisma-workflow';
import { codingDebuggingProductionIssuesContent } from '../src/content/personal/coding-debugging-production-issues';
import { codingImplementationDiscoveryScopingContent } from '../src/content/personal/coding-implementation-discovery-scoping';
import { codingImplementationStakeholderCommunicationSystemContent } from '../src/content/personal/coding-implementation-stakeholder-communication-system';
import { codingImplementationPlanningMechanicsContent } from '../src/content/personal/coding-implementation-planning-mechanics';
import { codingImplementationChangeManagementAdoptionContent } from '../src/content/personal/coding-implementation-change-management-adoption';
import { codingImplementationUatDefectTriageContent } from '../src/content/personal/coding-implementation-uat-defect-triage';
import { codingImplementationGoLiveHypercareContent } from '../src/content/personal/coding-implementation-go-live-hypercare';
import { codingImplementationKpiOutcomeTrackingContent } from '../src/content/personal/coding-implementation-kpi-outcome-tracking';
import { codingImplementationCrossFunctionalDecisionLeadershipContent } from '../src/content/personal/coding-implementation-cross-functional-decision-leadership';
import { codingCodeReadingNonAuthorsContent } from '../src/content/personal/coding-code-reading-non-authors';
import { codingStateManagementPatternsContent } from '../src/content/personal/coding-state-management-patterns';
import { codingCodeReviewBothSidesContent } from '../src/content/personal/coding-code-review-both-sides';
import { codingDependencyManagementDecisionsContent } from '../src/content/personal/coding-dependency-management-decisions';
import { codingEstimationScopingCommunication } from '../src/content/personal/coding-estimation-scoping-communication';
import { codingLiveIncidentCommunication } from '../src/content/personal/coding-live-incident-communication';
import { codingPersonalLearningMetrics } from '../src/content/personal/coding-personal-learning-metrics';
import { codingExternalProjectsSkillTransfer } from '../src/content/personal/coding-external-projects-skill-transfer';
import { CODING_GUIDE_IDS } from '../src/content/coding/registry';

const prisma = new PrismaClient();
const removedSampleActivityIds = ['coding-js-ts', 'spanish-refresher'];

async function runOptionalCleanup(label: string, action: () => Promise<unknown>): Promise<void> {
  try {
    await action();
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === 'P2021') {
      console.log(`  ⚠️ Skipping ${label}: table is missing in this database.`);
      return;
    }
    throw error;
  }
}

function validateCodingGuideRegistryAlignment(ids: readonly string[], seededIds: string[]): void {
  const missingFromRegistry = seededIds.filter((id) => !ids.includes(id));
  const missingFromSeed = ids.filter((id) => !seededIds.includes(id));

  if (missingFromRegistry.length || missingFromSeed.length) {
    throw new Error(
      `Coding guide registry mismatch.\n` +
      `Missing in registry: ${missingFromRegistry.join(', ') || 'none'}\n` +
      `Missing in seed: ${missingFromSeed.join(', ') || 'none'}`
    );
  }
}

const personalActivities = [
  {
    id: 'coding-variables-types',
    title: 'JavaScript Variables & Data Types',
    description: 'Personal coding guide covering variable declaration and core JavaScript data types.',
    level: 'beginner',
    content: codingVariablesTypesContent,
  },
  {
    id: 'coding-functions-parameters',
    title: 'Functions & Parameters',
    description: 'Personal coding guide on reusable functions, parameters, and return values.',
    level: 'beginner',
    content: codingFunctionsParametersContent,
  },
  {
    id: 'coding-loops-control-flow',
    title: 'Loops & Control Flow',
    description: 'Personal coding guide for conditionals, loops, and decision logic.',
    level: 'beginner',
    content: codingLoopsControlFlowContent,
  },
  {
    id: 'coding-arrays-objects',
    title: 'Arrays & Objects',
    description: 'Personal coding guide for organizing and working with structured JavaScript data.',
    level: 'beginner',
    content: codingArraysObjectsContent,
  },
  {
    id: 'coding-async-promises',
    title: 'Async/Await & Promises',
    description: 'Personal coding guide for asynchronous workflows and promise handling.',
    level: 'intermediate',
    content: codingAsyncPromisesContent,
  },
  // New guides - Foundations
  {
    id: 'coding-operators-expressions',
    title: 'Operators & Expressions',
    description: 'Master arithmetic, comparison, logical, ternary, nullish coalescing, and optional chaining operators.',
    level: 'beginner',
    content: codingOperatorsExpressionsContent,
  },
  {
    id: 'coding-strings-methods',
    title: 'Strings & String Methods',
    description: 'Work with text using template literals and common methods like split, join, trim, includes, and replace.',
    level: 'beginner',
    content: codingStringsMethodsContent,
  },
  {
    id: 'coding-error-handling',
    title: 'Error Handling',
    description: 'Learn try/catch/finally, throwing errors, Error types, and debugging basics.',
    level: 'beginner',
    content: codingErrorHandlingContent,
  },
  // New guides - Intermediate
  {
    id: 'coding-react-fundamentals',
    title: 'React Fundamentals',
    description: 'Make strong React decisions for component boundaries, state modeling, rendering behavior, and effect usage.',
    level: 'intermediate',
    content: codingReactFundamentalsContent,
  },
  {
    id: 'coding-nextjs-architecture-decision-tree',
    title: 'Next.js Architecture Decision Tree',
    description: 'Learn App Router mental models, server/client boundary decisions, data-fetch placement, and deployment triage reasoning.',
    level: 'intermediate',
    content: codingNextjsArchitectureDecisionTreeContent,
  },
  {
    id: 'coding-dom-manipulation',
    title: 'DOM Manipulation',
    description: 'Build interactive web pages with element selection, events, and dynamic content.',
    level: 'intermediate',
    content: codingDomManipulationContent,
  },
  {
    id: 'coding-classes-oop',
    title: 'Classes & OOP',
    description: 'Object-oriented programming with constructors, methods, inheritance, and the this keyword.',
    level: 'intermediate',
    content: codingClassesOopContent,
  },
  {
    id: 'coding-modules-imports',
    title: 'Modules & Imports',
    description: 'Organize code with ES modules, named/default exports, and dynamic imports.',
    level: 'intermediate',
    content: codingModulesImportsContent,
  },
  {
    id: 'coding-working-with-apis',
    title: 'Working with APIs',
    description: 'Connect to APIs using fetch(), handle JSON, HTTP methods, and authentication.',
    level: 'intermediate',
    content: codingWorkingWithApisContent,
  },
  // New guides - Advanced
  {
    id: 'coding-implementation-discovery-scoping',
    title: 'Implementation Discovery + Scoping Discipline',
    description: 'Run structured discovery, define scope boundaries, and build implementation-ready plans with clear ownership and risk controls.',
    level: 'advanced',
    content: codingImplementationDiscoveryScopingContent,
  },
  {
    id: 'coding-implementation-stakeholder-communication-system',
    title: 'Implementation Stakeholder Communication System',
    description: 'Design communication cadences, escalation triggers, and update structures that keep stakeholders aligned and delivery decisions fast.',
    level: 'advanced',
    content: codingImplementationStakeholderCommunicationSystemContent,
  },
  {
    id: 'coding-implementation-planning-mechanics',
    title: 'Implementation Planning Mechanics',
    description: 'Build workback plans, dependency maps, and RAID operations that keep execution predictable under changing constraints.',
    level: 'advanced',
    content: codingImplementationPlanningMechanicsContent,
  },
  {
    id: 'coding-implementation-change-management-adoption',
    title: 'Implementation Change Management + Adoption',
    description: 'Plan rollout communications, enablement, resistance handling, and adoption metrics so behavior change follows launch.',
    level: 'advanced',
    content: codingImplementationChangeManagementAdoptionContent,
  },
  {
    id: 'coding-implementation-uat-defect-triage',
    title: 'Implementation UAT Leadership + Defect Triage',
    description: 'Lead UAT with clear acceptance gates and triage defects by impact so launch decisions remain objective and safe.',
    level: 'advanced',
    content: codingImplementationUatDefectTriageContent,
  },
  {
    id: 'coding-implementation-go-live-hypercare',
    title: 'Implementation Go-Live + Hypercare Operations',
    description: 'Run launch readiness gates, cutover runbooks, hypercare cadences, and support transition criteria with operational rigor.',
    level: 'advanced',
    content: codingImplementationGoLiveHypercareContent,
  },
  {
    id: 'coding-implementation-kpi-outcome-tracking',
    title: 'Implementation KPI Framework + Outcome Tracking',
    description: 'Design KPI trees, define metric contracts, and run action-oriented review loops that connect implementation to business outcomes.',
    level: 'advanced',
    content: codingImplementationKpiOutcomeTrackingContent,
  },
  {
    id: 'coding-implementation-cross-functional-decision-leadership',
    title: 'Implementation Cross-Functional Decision Leadership',
    description: 'Lead cross-functional decisions with clear tradeoff framing, conflict resolution, and decision records that keep execution aligned.',
    level: 'advanced',
    content: codingImplementationCrossFunctionalDecisionLeadershipContent,
  },
  {
    id: 'coding-git-pr-communication',
    title: 'Git + PR Communication for Real Teams',
    description: 'Build high-signal branch, commit, PR, and review communication habits for safer collaboration and faster debugging.',
    level: 'advanced',
    content: codingGitPrCommunicationContent,
  },
  {
    id: 'coding-testing-fundamentals-confidence',
    title: 'Testing Fundamentals for Confidence',
    description: 'Choose the right test layers, write regression protections, and communicate risk coverage for safer releases.',
    level: 'advanced',
    content: codingTestingFundamentalsConfidenceContent,
  },
  {
    id: 'coding-api-contract-prisma-workflow',
    title: 'API Contract + Prisma Workflow',
    description: 'Design stable API contracts, run Prisma schema changes safely, and build seed/migration workflows with rollback awareness.',
    level: 'advanced',
    content: codingApiContractPrismaWorkflowContent,
  },
  {
    id: 'coding-debugging-production-issues',
    title: 'Debugging Production Issues',
    description: 'Run incident triage for Vercel logs, environment failures, rollback vs forward-fix decisions, and prevention follow-ups.',
    level: 'advanced',
    content: codingDebuggingProductionIssuesContent,
  },
  {
    id: 'coding-typescript-deep-dive',
    title: 'TypeScript Deep Dive',
    description: 'Advanced TypeScript: interfaces, generics, union types, type guards, and utility types.',
    level: 'advanced',
    content: codingTypescriptDeepDiveContent,
  },
  {
    id: 'coding-array-method-mastery',
    title: 'Array Method Mastery',
    description: 'Master map, filter, reduce, find, some, every, and method chaining for data transformation.',
    level: 'advanced',
    content: codingArrayMethodMasteryContent,
  },
  {
    id: 'coding-debugging-devtools',
    title: 'Debugging & Dev Tools',
    description: 'Debug like a pro with console methods, breakpoints, Network tab, and debugging strategies.',
    level: 'advanced',
    content: codingDebuggingDevtoolsContent,
  },
  {
    id: 'coding-js-ts-interview-prep',
    title: 'JS/TS Interview Prep Sprint',
    description: 'Interview-focused coding guide with complexity choices, JS/TS patterns, async decisions, and mock walkthroughs.',
    level: 'advanced',
    content: codingJsTsInterviewPrepContent,
  },
  {
    id: 'coding-code-reading-non-authors',
    title: 'Code Reading for Non-Authors',
    description: 'Learn to trace features through unfamiliar codebases, follow data flow, read tests as documentation, and ask high-signal questions.',
    level: 'intermediate',
    content: codingCodeReadingNonAuthorsContent,
  },
  {
    id: 'coding-state-management-patterns',
    title: 'State Management Patterns Beyond Basics',
    description: 'Master local state, lifting state, Context API, and Redux/Zustand decisions with anti-patterns and debugging strategies.',
    level: 'intermediate',
    content: codingStateManagementPatternsContent,
  },
  {
    id: 'coding-code-review-both-sides',
    title: 'Reading & Giving Code Review Feedback',
    description: 'Give constructive feedback, distinguish blocking from suggestions, use questions to coach, and respond professionally to reviews.',
    level: 'intermediate',
    content: codingCodeReviewBothSidesContent,
  },
  {
    id: 'coding-dependency-management-decisions',
    title: 'Dependency Management Decisions',
    description: 'Read changelogs, evaluate breaking changes, assess security patches, and communicate dependency risk to stakeholders.',
    level: 'intermediate',
    content: codingDependencyManagementDecisionsContent,
  },
  {
    id: 'coding-estimation-scoping-communication',
    title: 'Estimation, Scoping & Technical Communication',
    description: 'Master feature scoping, technical estimation, uncertainty ranges, timeline translation, and when to push back on timelines.',
    level: 'advanced',
    content: codingEstimationScopingCommunication,
  },
  {
    id: 'coding-live-incident-communication',
    title: 'Live Incident Communication',
    description: 'Keep stakeholders informed during outages with honest updates, clear root causes, prevention steps, and appropriate escalation.',
    level: 'advanced',
    content: codingLiveIncidentCommunication,
  },
  {
    id: 'coding-personal-learning-metrics',
    title: 'Personal Learning Metrics for Developers',
    description: 'Define and track KPIs for your own growth: time-to-contribution, debugging accuracy, PR approval rate, and code reading speed.',
    level: 'intermediate',
    content: codingPersonalLearningMetrics,
  },
  {
    id: 'coding-external-projects-skill-transfer',
    title: 'External Projects for Skill Transfer',
    description: 'Contribute to open-source, compare similar projects, build a public portfolio, and bring lessons back to your day job.',
    level: 'intermediate',
    content: codingExternalProjectsSkillTransfer,
  },
];

async function main() {
  console.log('🧠 Upserting personal activities...\n');
  validateCodingGuideRegistryAlignment(
    CODING_GUIDE_IDS,
    personalActivities.map((activity) => activity.id)
  );

  await prisma.activityProgress.deleteMany({
    where: {
      activityId: {
        in: removedSampleActivityIds,
      },
    },
  });

  await runOptionalCleanup('quizResponse cleanup', () =>
    prisma.quizResponse.deleteMany({
      where: {
        activityId: {
          in: removedSampleActivityIds,
        },
      },
    })
  );

  await runOptionalCleanup('speakingSubmission cleanup', () =>
    prisma.speakingSubmission.deleteMany({
      where: {
        activityId: {
          in: removedSampleActivityIds,
        },
      },
    })
  );

  await prisma.submission.deleteMany({
    where: {
      activityId: {
        in: removedSampleActivityIds,
      },
    },
  });

  await prisma.assignment.deleteMany({
    where: {
      activityId: {
        in: removedSampleActivityIds,
      },
    },
  });

  await prisma.activity.deleteMany({
    where: {
      id: {
        in: removedSampleActivityIds,
      },
    },
  });

  for (const activity of personalActivities) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: {
        title: activity.title,
        description: activity.description,
        type: 'guide',
        category: 'coding',
        level: activity.level,
        content: JSON.stringify(activity.content),
      },
      create: {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: 'guide',
        category: 'coding',
        level: activity.level,
        content: JSON.stringify(activity.content),
      },
    });

    console.log(`  ✅ ${activity.title}`);
  }

  console.log('\n✨ Personal activities seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
