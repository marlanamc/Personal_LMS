const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');

const prisma = new PrismaClient();

async function importPresentPerfectGuide() {
    try {
        // Read the HTML file
        const htmlPath = path.join(__dirname, '../_legacy/activities/grammar/tenses/present-perfect-complete-guide.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
        
        const root = parse(htmlContent);

        // Extract title
        const title = root.querySelector('title')?.textContent?.replace(' | ESOL Teacher Resources', '') || 'Present Perfect - Complete Guide';

        // Extract description
        const metaDescription = root.querySelector('meta[name="description"]')?.getAttribute('content') || 
            'Complete step-by-step guide to Present Perfect tense with past participles, For/Since/Already/Yet/Just, and Past Simple comparison for intermediate learners.';

        // Extract sections
        const sections = [];
        const stepSections = root.querySelectorAll('.step-section');
        
        stepSections.forEach((section, index) => {
            const stepNumber = section.querySelector('.step-number')?.textContent.trim() || (index + 1);
            const stepTitle = section.querySelector('.step-title')?.textContent.trim() || '';
            
            // Extract explanation
            const explanationBox = section.querySelector('.explanation-box');
            const explanation = explanationBox ? explanationBox.textContent.trim() : '';

            // Extract formula if exists
            const formulaBox = section.querySelector('.formula-box');
            let formula = null;
            if (formulaBox) {
                const formulaParts = formulaBox.querySelectorAll('.formula-part');
                formula = Array.from(formulaParts).map(part => ({
                    text: part.textContent.trim(),
                    type: part.classList.contains('subject-part') ? 'subject' :
                          part.classList.contains('verb-part') ? 'verb' :
                          part.classList.contains('object-part') ? 'object' : 'other'
                }));
            }

            // Extract examples
            const examples = [];
            const exampleBoxes = section.querySelectorAll('.example-box .example');
            exampleBoxes.forEach(box => {
                const exampleText = box.textContent.trim();
                if (exampleText) {
                    examples.push(exampleText);
                }
            });

            // Extract exercises
            const exercises = [];
            const exerciseSections = section.querySelectorAll('.exercise-section');
            exerciseSections.forEach(exerciseSection => {
                const exerciseTitle = exerciseSection.querySelector('.exercise-title')?.textContent.trim() || '';
                const instructions = exerciseSection.querySelector('.exercise-instructions')?.textContent.trim() || '';
                
                const exerciseItems = [];
                const items = exerciseSection.querySelectorAll('.exercise-item');
                items.forEach(item => {
                    const label = item.querySelector('label')?.textContent.trim() || '';
                    const input = item.querySelector('input[type="text"]');
                    const select = item.querySelector('select');
                    const radioInputs = item.querySelectorAll('input[type="radio"]');
                    
                    if (input) {
                        exerciseItems.push({
                            type: 'text',
                            label: label,
                            placeholder: input.getAttribute('placeholder') || ''
                        });
                    } else if (select) {
                        const options = Array.from(select.querySelectorAll('option')).map(opt => opt.textContent.trim());
                        exerciseItems.push({
                            type: 'select',
                            label: label,
                            options: options
                        });
                    } else if (radioInputs.length > 0) {
                        const radioOptions = Array.from(radioInputs).map(radio => ({
                            value: radio.getAttribute('value') || '',
                            label: radio.nextSibling?.textContent?.trim() || ''
                        }));
                        exerciseItems.push({
                            type: 'radio',
                            label: label,
                            options: radioOptions
                        });
                    }
                });

                if (exerciseItems.length > 0) {
                    exercises.push({
                        title: exerciseTitle,
                        instructions: instructions,
                        items: exerciseItems
                    });
                }
            });

            sections.push({
                stepNumber: parseInt(stepNumber) || index + 1,
                title: stepTitle,
                explanation: explanation,
                formula: formula,
                examples: examples,
                exercises: exercises
            });
        });

        // Get teacher user
        const teacher = await prisma.user.findFirst({
            where: { role: 'teacher' }
        });

        if (!teacher) {
            throw new Error('No teacher user found. Please run seed first.');
        }

        // Create activity content structure
        const activityContent = {
            type: 'interactive-guide',
            sections: sections,
            metadata: {
                source: 'legacy',
                originalFile: 'present-perfect-complete-guide.html'
            }
        };

        // Create or update the activity
        const activity = await prisma.activity.upsert({
            where: { id: 'present-perfect-guide' },
            update: {
                title: title,
                description: metaDescription,
                type: 'guide',
                category: 'grammar',
                level: 'intermediate',
                content: JSON.stringify(activityContent),
                createdBy: teacher.id,
            },
            create: {
                id: 'present-perfect-guide',
                title: title,
                description: metaDescription,
                type: 'guide',
                category: 'grammar',
                level: 'intermediate',
                content: JSON.stringify(activityContent),
                createdBy: teacher.id,
            },
        });

        console.log('✅ Successfully imported Present Perfect Guide!');
        console.log(`   Activity ID: ${activity.id}`);
        console.log(`   Title: ${activity.title}`);
        console.log(`   Sections: ${sections.length}`);
        console.log(`   Total Exercises: ${sections.reduce((sum, s) => sum + s.exercises.length, 0)}`);

        return activity;
    } catch (error) {
        console.error('❌ Error importing guide:', error);
        throw error;
    }
}

// Run the import
importPresentPerfectGuide()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });









