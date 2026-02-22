import type { InteractiveGuideContent } from "@/types/activity";

export const spanishRestaurantConversationsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Ordering Food in Spanish: Real Conversations",
            icon: "🍽️",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">One of the most rewarding parts of learning Spanish is ordering food like a local! Whether you're at a <em>comedor</em> in Guatemala, a <em>soda</em> in Costa Rica, or a taquería in Mexico, these phrases will help you navigate any restaurant situation with confidence.</p>
                </div>

                <h3>What You'll Learn</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li>Getting a table and asking for the menu</li>
                    <li>Understanding what's available and asking questions</li>
                    <li>Ordering food and drinks politely</li>
                    <li>Handling special requests and modifications</li>
                    <li>Paying the bill and leaving tips</li>
                </ul>
            `,
            exercises: [
                {
                    id: "src-intro-1",
                    title: "Quick Context Check",
                    instructions: "Match these Latin American restaurant types with their descriptions.",
                    items: [
                        {
                            type: "radio",
                            label: "A 'comedor' in Central America is:",
                            options: [
                                { value: "casual", label: "A casual, affordable local eatery" },
                                { value: "fancy", label: "A fancy fine-dining restaurant" },
                            ],
                            expectedAnswer: "casual",
                        },
                        {
                            type: "radio",
                            label: "A 'soda' in Costa Rica is:",
                            options: [
                                { value: "drink", label: "A place that only sells soft drinks" },
                                { value: "restaurant", label: "A small, family-run restaurant" },
                            ],
                            expectedAnswer: "restaurant",
                        },
                    ],
                },
            ],
        },

        // Arriving at the Restaurant
        {
            id: "arriving",
            stepNumber: 1,
            title: "Arriving & Getting a Table",
            icon: "🚪",
            explanation: `
                <h3>First Impressions</h3>
                <p>When you enter a restaurant in Latin America, you'll often be greeted warmly. At casual places, you might seat yourself. At nicer restaurants, wait to be seated.</p>
            `,
            usageMeanings: [
                {
                    title: "👋 Greeting the Staff",
                    description: "How to say hello and request a table",
                    examples: [
                        {
                            sentence: "<strong>Buenas tardes</strong>, ¿tienen mesa para dos?",
                            explanation: "Good afternoon, do you have a table for two? Always greet first!",
                        },
                        {
                            sentence: "Hola, <strong>somos tres</strong>. ¿Hay espacio?",
                            explanation: "Hi, we are three. Is there space? A more casual approach.",
                        },
                        {
                            sentence: "<strong>Una mesa para uno</strong>, por favor.",
                            explanation: "A table for one, please. Don't be shy eating alone!",
                        },
                    ],
                },
                {
                    title: "📋 Common Responses",
                    description: "What you might hear from the server",
                    examples: [
                        {
                            sentence: "Sí, <strong>pasen por aquí</strong>.",
                            explanation: "Yes, come this way. Follow the server!",
                        },
                        {
                            sentence: "Un momento, por favor. <strong>Voy a preparar una mesa</strong>.",
                            explanation: "One moment, please. I'm going to prepare a table.",
                        },
                        {
                            sentence: "Lo siento, <strong>estamos llenos</strong>. ¿Pueden esperar?",
                            explanation: "Sorry, we're full. Can you wait?",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "src-arriving-1",
                    title: "Request a Table",
                    instructions: "Fill in the blanks to request a table.",
                    items: [
                        {
                            type: "text",
                            label: "Buenas noches, ¿tienen ______ para cuatro?",
                            correctAnswer: "mesa",
                            expectedAnswers: ["mesa", "una mesa"],
                        },
                        {
                            type: "text",
                            label: "Hola, ______ dos personas.",
                            correctAnswer: "somos",
                            expectedAnswers: ["somos"],
                        },
                        {
                            type: "text",
                            label: "Una mesa para ______, por favor. (1 person)",
                            correctAnswer: "uno",
                            expectedAnswers: ["uno", "una persona"],
                        },
                    ],
                },
            ],
        },

        // Asking for the Menu
        {
            id: "menu",
            stepNumber: 2,
            title: "Getting the Menu & Asking Questions",
            icon: "📖",
            explanation: `
                <h3>Understanding What's Available</h3>
                <p>At many casual Latin American eateries, there might not be a printed menu. Instead, ask what's available that day! At other places, don't be afraid to ask questions about unfamiliar dishes.</p>
            `,
            usageMeanings: [
                {
                    title: "📋 Asking for the Menu",
                    description: "Different ways to request a menu",
                    examples: [
                        {
                            sentence: "¿<strong>Me puede traer el menú</strong>, por favor?",
                            explanation: "Can you bring me the menu, please? Polite and formal.",
                        },
                        {
                            sentence: "¿<strong>Tienen menú</strong>?",
                            explanation: "Do you have a menu? For casual spots where menus are optional.",
                        },
                        {
                            sentence: "¿<strong>Qué hay hoy</strong>?",
                            explanation: "What do you have today? Perfect for comedores with daily specials.",
                        },
                    ],
                },
                {
                    title: "❓ Asking About Dishes",
                    description: "How to get more information",
                    examples: [
                        {
                            sentence: "¿<strong>Qué lleva</strong> este plato?",
                            explanation: "What's in this dish? Great for understanding ingredients.",
                        },
                        {
                            sentence: "¿<strong>Qué me recomienda</strong>?",
                            explanation: "What do you recommend? Let locals guide you to the best dishes!",
                        },
                        {
                            sentence: "¿<strong>Es picante</strong>?",
                            explanation: "Is it spicy? Important in Central America!",
                        },
                        {
                            sentence: "¿<strong>Tienen algo sin carne</strong>?",
                            explanation: "Do you have anything without meat? For vegetarians.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Cultural Tip",
                content: "In many Central American comedores, the 'menu del día' (daily menu) is often the best value—a full meal with soup, main dish, drink, and sometimes dessert for a set price!",
            },
            exercises: [
                {
                    id: "src-menu-1",
                    title: "Ask the Right Question",
                    instructions: "Choose the best question for each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "You want to know if a dish has meat:",
                            options: [
                                { value: "a", label: "¿Qué lleva este plato?" },
                                { value: "b", label: "¿Cuánto cuesta?" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "You're not sure what to order:",
                            options: [
                                { value: "a", label: "La cuenta, por favor" },
                                { value: "b", label: "¿Qué me recomienda?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "It's a casual place with no printed menu:",
                            options: [
                                { value: "a", label: "¿Qué hay hoy?" },
                                { value: "b", label: "¿Me puede traer el menú?" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        // Ordering
        {
            id: "ordering",
            stepNumber: 3,
            title: "Placing Your Order",
            icon: "✍️",
            explanation: `
                <h3>Time to Order!</h3>
                <p>When you're ready to order, get the server's attention politely. Remember: in Latin America, servers won't rush you—take your time!</p>
            `,
            usageMeanings: [
                {
                    title: "🙋 Getting Attention",
                    description: "How to signal you're ready",
                    examples: [
                        {
                            sentence: "<strong>Disculpe</strong>, estamos listos para ordenar.",
                            explanation: "Excuse me, we're ready to order. Polite way to call the server.",
                        },
                        {
                            sentence: "Cuando pueda, <strong>queremos ordenar</strong>.",
                            explanation: "When you can, we'd like to order. Very polite phrasing.",
                        },
                    ],
                },
                {
                    title: "🍲 Ordering Food",
                    description: "Different ways to place your order",
                    examples: [
                        {
                            sentence: "<strong>Para mí</strong>, el pollo con arroz.",
                            explanation: "For me, the chicken with rice. Simple and direct.",
                        },
                        {
                            sentence: "<strong>Yo quiero</strong> las enchiladas, por favor.",
                            explanation: "I want the enchiladas, please. Common ordering phrase.",
                        },
                        {
                            sentence: "<strong>Me trae</strong> una sopa de tortilla.",
                            explanation: "Bring me a tortilla soup. Casual but polite.",
                        },
                        {
                            sentence: "<strong>Voy a pedir</strong> el casado.",
                            explanation: "I'm going to order the casado. (Costa Rican typical plate)",
                        },
                    ],
                },
                {
                    title: "🥤 Ordering Drinks",
                    description: "Asking for beverages",
                    examples: [
                        {
                            sentence: "¿<strong>Qué refrescos tienen</strong>?",
                            explanation: "What soft drinks do you have? Refrescos = sodas/fresh juices.",
                        },
                        {
                            sentence: "<strong>Un agua</strong>, por favor.",
                            explanation: "A water, please. Keep it simple!",
                        },
                        {
                            sentence: "¿<strong>Tienen agua pura</strong>? (or) ¿Tienen agua embotellada?",
                            explanation: "Do you have purified/bottled water? Important for travelers.",
                        },
                        {
                            sentence: "<strong>Dos cervezas</strong>, por favor.",
                            explanation: "Two beers, please.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "src-ordering-1",
                    title: "Order These Items",
                    instructions: "Write how you would order each item.",
                    items: [
                        {
                            type: "text",
                            label: "Order chicken for yourself: '______, el pollo.'",
                            correctAnswer: "Para mí",
                            expectedAnswers: ["Para mí", "para mi", "Para mi"],
                        },
                        {
                            type: "text",
                            label: "Ask for a water: 'Un ______, por favor.'",
                            correctAnswer: "agua",
                            expectedAnswers: ["agua"],
                        },
                        {
                            type: "text",
                            label: "Say you want the tacos: 'Yo ______ los tacos.'",
                            correctAnswer: "quiero",
                            expectedAnswers: ["quiero"],
                        },
                    ],
                },
            ],
        },

        // Special Requests
        {
            id: "modifications",
            stepNumber: 4,
            title: "Special Requests & Modifications",
            icon: "🌶️",
            explanation: `
                <h3>Customizing Your Order</h3>
                <p>Don't be shy about asking for modifications! Most restaurants are happy to accommodate reasonable requests.</p>
            `,
            usageMeanings: [
                {
                    title: "🚫 Removing Ingredients",
                    description: "How to ask for something without specific items",
                    examples: [
                        {
                            sentence: "<strong>Sin cebolla</strong>, por favor.",
                            explanation: "Without onion, please.",
                        },
                        {
                            sentence: "¿<strong>Lo puede hacer sin picante</strong>?",
                            explanation: "Can you make it without spice?",
                        },
                        {
                            sentence: "<strong>Sin queso</strong>, soy alérgico/a.",
                            explanation: "Without cheese, I'm allergic.",
                        },
                    ],
                },
                {
                    title: "➕ Adding or Changing",
                    description: "Requesting additions or substitutions",
                    examples: [
                        {
                            sentence: "¿<strong>Puedo pedir extra salsa</strong>?",
                            explanation: "Can I ask for extra salsa?",
                        },
                        {
                            sentence: "¿<strong>Viene con tortillas</strong>?",
                            explanation: "Does it come with tortillas?",
                        },
                        {
                            sentence: "¿<strong>Me puede traer más</strong> limón?",
                            explanation: "Can you bring me more lime?",
                        },
                    ],
                },
                {
                    title: "⚠️ Dietary Needs",
                    description: "Communicating allergies and restrictions",
                    examples: [
                        {
                            sentence: "<strong>Soy vegetariano/a</strong>.",
                            explanation: "I'm vegetarian. (Use -o if male, -a if female)",
                        },
                        {
                            sentence: "<strong>No puedo comer mariscos</strong>.",
                            explanation: "I can't eat seafood.",
                        },
                        {
                            sentence: "<strong>Tengo alergia al</strong> maní.",
                            explanation: "I have an allergy to peanuts.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "src-mods-1",
                    title: "Make These Requests",
                    instructions: "Fill in the blanks to make these special requests.",
                    items: [
                        {
                            type: "text",
                            label: "Request no onion: '______ cebolla, por favor.'",
                            correctAnswer: "Sin",
                            expectedAnswers: ["Sin", "sin"],
                        },
                        {
                            type: "text",
                            label: "Say you're vegetarian (female): 'Soy ______.'",
                            correctAnswer: "vegetariana",
                            expectedAnswers: ["vegetariana"],
                        },
                        {
                            type: "text",
                            label: "Ask if it comes with rice: '¿Viene ______ arroz?'",
                            correctAnswer: "con",
                            expectedAnswers: ["con"],
                        },
                    ],
                },
            ],
        },

        // Paying
        {
            id: "paying",
            stepNumber: 5,
            title: "The Check & Paying",
            icon: "💰",
            explanation: `
                <h3>Finishing Your Meal</h3>
                <p>In Latin America, the server won't bring you the check until you ask. Take your time enjoying your meal and conversation!</p>
            `,
            usageMeanings: [
                {
                    title: "📝 Asking for the Check",
                    description: "How to request the bill",
                    examples: [
                        {
                            sentence: "<strong>La cuenta</strong>, por favor.",
                            explanation: "The check, please. The most common phrase.",
                        },
                        {
                            sentence: "¿<strong>Nos trae la cuenta</strong>, por favor?",
                            explanation: "Can you bring us the check, please? More polite version.",
                        },
                        {
                            sentence: "¿<strong>Cuánto es</strong>?",
                            explanation: "How much is it? For quick transactions.",
                        },
                    ],
                },
                {
                    title: "💳 Paying",
                    description: "Different payment situations",
                    examples: [
                        {
                            sentence: "¿<strong>Aceptan tarjeta</strong>?",
                            explanation: "Do you accept cards?",
                        },
                        {
                            sentence: "Voy a <strong>pagar en efectivo</strong>.",
                            explanation: "I'm going to pay in cash.",
                        },
                        {
                            sentence: "¿<strong>Está incluida la propina</strong>?",
                            explanation: "Is the tip included? Important to ask!",
                        },
                        {
                            sentence: "<strong>Quédese con el cambio</strong>.",
                            explanation: "Keep the change. A nice way to tip.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Tipping in Central America",
                content: "Tipping customs vary. In Costa Rica, a 10% service charge is often included. In Guatemala and Honduras, 10% is customary but not always included. Always check your bill first!",
            },
            exercises: [
                {
                    id: "src-paying-1",
                    title: "Handle the Payment",
                    instructions: "Choose the correct phrase for each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "You want to ask for the bill:",
                            options: [
                                { value: "a", label: "La cuenta, por favor" },
                                { value: "b", label: "El menú, por favor" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "You want to know if you can pay by card:",
                            options: [
                                { value: "a", label: "¿Aceptan tarjeta?" },
                                { value: "b", label: "¿Tienen cambio?" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "Ask if tip is included: '¿Está incluida la ______?'",
                            correctAnswer: "propina",
                            expectedAnswers: ["propina"],
                        },
                    ],
                },
            ],
        },

        // Full Dialogue
        {
            id: "full-dialogue",
            stepNumber: 6,
            title: "Putting It All Together",
            icon: "🗣️",
            explanation: `
                <h3>A Complete Restaurant Conversation</h3>
                <p>Here's how a typical restaurant visit might go. Practice reading through this dialogue!</p>

                <div style="background: #f8f8f8; padding: 1.5rem; border-radius: 0.5rem; margin: 1rem 0; line-height: 2;">
                    <p><strong>Mesero:</strong> Buenas tardes, ¿cuántos son?</p>
                    <p><strong>Tú:</strong> Buenas tardes, somos dos.</p>
                    <p><strong>Mesero:</strong> Perfecto, pasen por aquí. Aquí tienen el menú.</p>
                    <p><strong>Tú:</strong> Gracias. ¿Qué nos recomienda?</p>
                    <p><strong>Mesero:</strong> El pollo con papas está muy bueno hoy.</p>
                    <p><strong>Tú:</strong> Perfecto. Para mí, el pollo. Y para ella, las enchiladas.</p>
                    <p><strong>Mesero:</strong> ¿Y para tomar?</p>
                    <p><strong>Tú:</strong> Dos aguas, por favor. ¿Tienen limonada?</p>
                    <p><strong>Mesero:</strong> Sí, tenemos limonada natural.</p>
                    <p><strong>Tú:</strong> Una limonada también, por favor.</p>
                    <p><em>...después de comer...</em></p>
                    <p><strong>Tú:</strong> ¡Muy rico! La cuenta, por favor.</p>
                    <p><strong>Mesero:</strong> Aquí tiene. Son 85 quetzales.</p>
                    <p><strong>Tú:</strong> ¿Aceptan tarjeta?</p>
                    <p><strong>Mesero:</strong> Sí, claro.</p>
                    <p><strong>Tú:</strong> Perfecto. Gracias por todo.</p>
                    <p><strong>Mesero:</strong> ¡Gracias a ustedes! ¡Que les vaya bien!</p>
                </div>
            `,
            exercises: [
                {
                    id: "src-dialogue-1",
                    title: "Dialogue Comprehension",
                    instructions: "Answer based on the dialogue above.",
                    items: [
                        {
                            type: "radio",
                            label: "How many people are dining?",
                            options: [
                                { value: "1", label: "One" },
                                { value: "2", label: "Two" },
                                { value: "3", label: "Three" },
                            ],
                            expectedAnswer: "2",
                        },
                        {
                            type: "radio",
                            label: "What did the server recommend?",
                            options: [
                                { value: "a", label: "Enchiladas" },
                                { value: "b", label: "Chicken with potatoes" },
                                { value: "c", label: "Limonada" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "How did they pay?",
                            options: [
                                { value: "a", label: "Cash" },
                                { value: "b", label: "Card" },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },

        // Mini Quiz
        {
            id: "review",
            title: "Restaurant Spanish Review",
            icon: "🎓",
            explanation: `
                <h3>Test Your Skills!</h3>
                <p>You've learned all the essentials for ordering food in Spanish. Let's see how much you remember!</p>
            `,
            exercises: [
                {
                    id: "src-review-1",
                    title: "Quick Response Practice",
                    instructions: "Write the Spanish phrase for each situation.",
                    items: [
                        {
                            type: "text",
                            label: "Request a table for three: 'Una ______ para tres, por favor.'",
                            correctAnswer: "mesa",
                            expectedAnswers: ["mesa"],
                        },
                        {
                            type: "text",
                            label: "Ask what they recommend: '¿Qué me ______?'",
                            correctAnswer: "recomienda",
                            expectedAnswers: ["recomienda"],
                        },
                        {
                            type: "text",
                            label: "Order chicken for yourself: '______ mí, el pollo.'",
                            correctAnswer: "Para",
                            expectedAnswers: ["Para", "para"],
                        },
                        {
                            type: "text",
                            label: "Say the food was delicious: '¡Muy ______!'",
                            correctAnswer: "rico",
                            expectedAnswers: ["rico", "rica", "delicioso"],
                        },
                        {
                            type: "text",
                            label: "Ask for the check: 'La ______, por favor.'",
                            correctAnswer: "cuenta",
                            expectedAnswers: ["cuenta"],
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "q1",
            question: "How do you ask for a table for two?",
            options: [
                { value: "a", label: "Una mesa para dos, por favor" },
                { value: "b", label: "La cuenta, por favor" },
                { value: "c", label: "¿Qué hay hoy?" },
            ],
            correctAnswer: "a",
            explanation: "Una mesa para dos, por favor = A table for two, please.",
        },
        {
            id: "q2",
            question: "What does '¿Qué me recomienda?' mean?",
            options: [
                { value: "a", label: "What's in this dish?" },
                { value: "b", label: "What do you recommend?" },
                { value: "c", label: "How much is it?" },
            ],
            correctAnswer: "b",
            explanation: "¿Qué me recomienda? = What do you recommend? A great way to discover local favorites!",
        },
        {
            id: "q3",
            question: "How do you say 'For me, the chicken'?",
            options: [
                { value: "a", label: "Para mí, el pollo" },
                { value: "b", label: "Sin pollo, por favor" },
                { value: "c", label: "¿Tienen pollo?" },
            ],
            correctAnswer: "a",
            explanation: "Para mí, el pollo = For me, the chicken. A direct way to order.",
        },
        {
            id: "q4",
            question: "How do you ask if they accept cards?",
            options: [
                { value: "a", label: "¿Cuánto cuesta?" },
                { value: "b", label: "¿Aceptan tarjeta?" },
                { value: "c", label: "¿Tienen cambio?" },
            ],
            correctAnswer: "b",
            explanation: "¿Aceptan tarjeta? = Do you accept cards?",
        },
        {
            id: "q5",
            question: "How do you say 'without onion'?",
            options: [
                { value: "a", label: "Con cebolla" },
                { value: "b", label: "Sin cebolla" },
                { value: "c", label: "Más cebolla" },
            ],
            correctAnswer: "b",
            explanation: "Sin cebolla = Without onion. Sin = without.",
        },
        {
            id: "q6",
            question: "What does 'La cuenta, por favor' mean?",
            options: [
                { value: "a", label: "The menu, please" },
                { value: "b", label: "The check, please" },
                { value: "c", label: "One moment, please" },
            ],
            correctAnswer: "b",
            explanation: "La cuenta = The check/bill. Essential for finishing your meal!",
        },
        {
            id: "q7",
            question: "How would you say you're vegetarian (female)?",
            options: [
                { value: "a", label: "Soy vegetariano" },
                { value: "b", label: "Soy vegetariana" },
                { value: "c", label: "Tengo vegetariana" },
            ],
            correctAnswer: "b",
            explanation: "Soy vegetariana (for females). Use vegetariano if you're male.",
        },
        {
            id: "q8",
            question: "What's a casual way to ask what's available today?",
            options: [
                { value: "a", label: "¿Qué hay hoy?" },
                { value: "b", label: "¿Cuánto es?" },
                { value: "c", label: "¿Está incluida la propina?" },
            ],
            correctAnswer: "a",
            explanation: "¿Qué hay hoy? = What do you have today? Perfect for casual eateries.",
        },
        {
            id: "q9",
            question: "How do you compliment the food?",
            options: [
                { value: "a", label: "¡Muy rico!" },
                { value: "b", label: "¡Muy caro!" },
                { value: "c", label: "¡Muy lejos!" },
            ],
            correctAnswer: "a",
            explanation: "¡Muy rico! = Very delicious! Rico/a means tasty in Latin America.",
        },
        {
            id: "q10",
            question: "How do you ask if the tip is included?",
            options: [
                { value: "a", label: "¿Aceptan tarjeta?" },
                { value: "b", label: "¿Está incluida la propina?" },
                { value: "c", label: "¿Tienen cambio?" },
            ],
            correctAnswer: "b",
            explanation: "¿Está incluida la propina? = Is the tip included? Important to check!",
        },
    ],
};
