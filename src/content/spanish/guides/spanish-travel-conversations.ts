import type { InteractiveGuideContent } from "@/types/activity";

export const spanishTravelConversationsContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "introduction",
      title: "Travel Conversations in Spanish",
      icon: "✈️",
      explanation: `
        <h3>Navigate Your Trip with Confidence</h3>
        <p>Whether you're at the airport, checking into a hotel, asking for directions, or dealing with an emergency, these phrases will help you communicate clearly. Focus on high-frequency expressions you'll hear and use in real travel situations.</p>
        <h3>What You'll Learn</h3>
        <ul>
          <li>Airport and immigration phrases</li>
          <li>Hotel check-in and requests</li>
          <li>Asking for and understanding directions</li>
          <li>Basic emergency and pharmacy phrases</li>
        </ul>
      `,
      exercises: [
        {
          id: "travel-intro-1",
          title: "Quick Context Check",
          instructions: "Match the situation with the best phrase.",
          items: [
            {
              type: "radio",
              label: "At the airport, you need to find your gate:",
              options: [
                { value: "a", label: "¿Dónde está la puerta de embarque?" },
                { value: "b", label: "¿Dónde está el baño?" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "At a hotel, you want to check in:",
              options: [
                { value: "a", label: "Tengo una reserva." },
                { value: "b", label: "¿Cuánto cuesta?" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "airport",
      stepNumber: 1,
      title: "At the Airport",
      icon: "🛫",
      explanation: `
        <h3>Airport and Immigration</h3>
        <p>At the airport you'll need to find your gate, ask about your flight, and get through immigration. These phrases cover the most common situations.</p>
      `,
      usageMeanings: [
        {
          title: "Finding Your Way",
          description: "Asking for locations at the airport",
          examples: [
            { sentence: "<strong>¿Dónde está la puerta de embarque</strong> número 15?", explanation: "Where is gate 15? puerta de embarque = boarding gate." },
            { sentence: "<strong>¿Dónde está el control de pasaportes?</strong>", explanation: "Where is passport control?" },
            { sentence: "<strong>¿Dónde reclamo mi equipaje?</strong>", explanation: "Where do I claim my luggage?" },
          ],
        },
        {
          title: "Flight Information",
          description: "Asking about your flight",
          examples: [
            { sentence: "<strong>¿Mi vuelo sale a tiempo?</strong>", explanation: "Is my flight on time?" },
            { sentence: "<strong>¿A qué hora embarca</strong> el vuelo a Madrid?", explanation: "When does the flight to Madrid board?" },
            { sentence: "<strong>Necesito cambiar mi asiento.</strong>", explanation: "I need to change my seat." },
          ],
        },
      ],
      tipBox: {
        title: "Cultural tip",
        content: "In many Spanish-speaking airports, signs use both Spanish and English. 'Salida' = exit, 'Llegadas' = arrivals, 'Salidas' = departures.",
      },
      exercises: [
        {
          id: "travel-airport-1",
          title: "Airport Phrases",
          instructions: "Complete the phrase.",
          items: [
            { type: "text", label: "Where is gate 10? → ¿Dónde está la ___ de embarque número 10?", correctAnswer: "puerta", expectedAnswers: ["puerta"] },
            { type: "text", label: "Where do I claim my luggage? → ¿Dónde ___ mi equipaje?", correctAnswer: "reclamo", expectedAnswers: ["reclamo"] },
          ],
        },
      ],
    },
    {
      id: "hotel",
      stepNumber: 2,
      title: "Hotel Check-in and Requests",
      icon: "🏨",
      explanation: `
        <h3>At the Hotel</h3>
        <p>Checking in, asking about amenities, and making requests. Be polite with <em>quisiera</em> (I would like) or <em>¿Podría...?</em> (Could you...?).</p>
      `,
      usageMeanings: [
        {
          title: "Check-in",
          description: "At reception",
          examples: [
            { sentence: "<strong>Tengo una reserva</strong> a nombre de García.", explanation: "I have a reservation under the name García." },
            { sentence: "<strong>¿Tiene habitación</strong> disponible para esta noche?", explanation: "Do you have a room available for tonight?" },
            { sentence: "<strong>Quisiera</strong> una habitación con vista al mar.", explanation: "I would like a room with a sea view." },
          ],
        },
        {
          title: "Requests",
          description: "Asking for services",
          examples: [
            { sentence: "<strong>¿Podría traer</strong> una toalla extra?", explanation: "Could you bring an extra towel?" },
            { sentence: "<strong>¿A qué hora es el desayuno?</strong>", explanation: "What time is breakfast?" },
            { sentence: "<strong>¿Tiene Wi-Fi?</strong> ¿Cuál es la contraseña?", explanation: "Do you have Wi-Fi? What's the password?" },
          ],
        },
      ],
      exercises: [
        {
          id: "travel-hotel-1",
          title: "Hotel Phrases",
          instructions: "Choose the best phrase.",
          items: [
            { type: "radio", label: "You want to check in:", options: [{ value: "a", label: "Tengo una reserva." }, { value: "b", label: "¿Dónde está el baño?" }], expectedAnswer: "a" },
            { type: "radio", label: "You need an extra towel:", options: [{ value: "a", label: "¿Podría traer una toalla extra?" }, { value: "b", label: "La cuenta, por favor." }], expectedAnswer: "a" },
          ],
        },
      ],
    },
    {
      id: "directions",
      stepNumber: 3,
      title: "Asking for Directions",
      icon: "🧭",
      explanation: `
        <h3>Getting Around</h3>
        <p>Asking for and understanding directions. Key words: <em>derecha</em> (right), <em>izquierda</em> (left), <em>recto</em> (straight), <em>cerca</em> (near), <em>lejos</em> (far).</p>
      `,
      usageMeanings: [
        {
          title: "Asking",
          description: "How to ask for directions",
          examples: [
            { sentence: "<strong>¿Dónde está</strong> la plaza principal?", explanation: "Where is the main square?" },
            { sentence: "<strong>¿Cómo llego</strong> a la estación de autobuses?", explanation: "How do I get to the bus station?" },
            { sentence: "<strong>¿Está cerca o lejos?</strong>", explanation: "Is it near or far?" },
          ],
        },
        {
          title: "Understanding",
          description: "Typical responses",
          examples: [
            { sentence: "<strong>Siga recto</strong> dos cuadras.", explanation: "Go straight for two blocks." },
            { sentence: "<strong>Gire a la derecha</strong> en la esquina.", explanation: "Turn right at the corner." },
            { sentence: "<strong>Está a cinco minutos a pie.</strong>", explanation: "It's five minutes on foot." },
          ],
        },
      ],
      exercises: [
        {
          id: "travel-dir-1",
          title: "Directions",
          instructions: "Match the phrase with its meaning.",
          items: [
            { type: "radio", label: "'Siga recto' means:", options: [{ value: "a", label: "Go straight" }, { value: "b", label: "Turn left" }], expectedAnswer: "a" },
            { type: "radio", label: "'Gire a la derecha' means:", options: [{ value: "a", label: "Turn right" }, { value: "b", label: "Go straight" }], expectedAnswer: "a" },
          ],
        },
      ],
    },
    {
      id: "emergencies",
      stepNumber: 4,
      title: "Emergencies and Pharmacy",
      icon: "🆘",
      explanation: `
        <h3>When You Need Help</h3>
        <p>Basic phrases for emergencies, pharmacy, and medical situations. Keep these in mind for peace of mind.</p>
      `,
      usageMeanings: [
        {
          title: "Emergency",
          description: "Getting help",
          examples: [
            { sentence: "<strong>¡Necesito ayuda!</strong>", explanation: "I need help!" },
            { sentence: "<strong>¿Dónde está el hospital más cercano?</strong>", explanation: "Where is the nearest hospital?" },
            { sentence: "<strong>Llame a la policía</strong>, por favor.", explanation: "Call the police, please." },
          ],
        },
        {
          title: "Pharmacy",
          description: "At the farmacia",
          examples: [
            { sentence: "<strong>Necesito algo para el dolor de cabeza.</strong>", explanation: "I need something for a headache." },
            { sentence: "<strong>¿Tiene algo para el estómago?</strong>", explanation: "Do you have something for an upset stomach?" },
            { sentence: "<strong>¿Necesito receta?</strong>", explanation: "Do I need a prescription?" },
          ],
        },
      ],
      tipBox: {
        title: "Quick tip",
        content: "In most Spanish-speaking countries, dial 112 or 911 for emergencies. Pharmacy = farmacia.",
      },
      exercises: [
        {
          id: "travel-emerg-1",
          title: "Emergency Phrases",
          instructions: "Choose the correct phrase.",
          items: [
            { type: "radio", label: "You need help urgently:", options: [{ value: "a", label: "¡Necesito ayuda!" }, { value: "b", label: "¿Cuánto cuesta?" }], expectedAnswer: "a" },
            { type: "radio", label: "At the pharmacy, you have a headache:", options: [{ value: "a", label: "Necesito algo para el dolor de cabeza." }, { value: "b", label: "¿Dónde está el hotel?" }], expectedAnswer: "a" },
          ],
        },
      ],
    },
    {
      id: "quick-reference-travel",
      stepNumber: 5,
      title: "Quick Reference",
      icon: "📋",
      explanation: `
        <h3>At a Glance</h3>
        <p><strong>Airport:</strong> puerta de embarque, equipaje, vuelo. <strong>Hotel:</strong> reserva, habitación, toalla, Wi-Fi. <strong>Directions:</strong> derecha, izquierda, recto, cerca, lejos. <strong>Emergency:</strong> ayuda, hospital, farmacia.</p>
      `,
      exercises: [
        {
          id: "travel-quickref",
          title: "Recall",
          instructions: "Choose the best phrase.",
          items: [
            { type: "radio", label: "You want to ask where the gate is:", options: [{ value: "a", label: "¿Dónde está la puerta de embarque?" }, { value: "b", label: "Tengo una reserva." }], expectedAnswer: "a" },
            { type: "radio", label: "'Necesito ayuda' means:", options: [{ value: "a", label: "I need help" }, { value: "b", label: "I need a room" }], expectedAnswer: "a" },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    { id: "travel-q1", question: "¿Dónde está la puerta de embarque? means:", options: [{ value: "a", label: "Where is the boarding gate?" }, { value: "b", label: "Where is the bathroom?" }], correctAnswer: "a", explanation: "puerta de embarque = boarding gate." },
    { id: "travel-q2", question: "'Tengo una reserva' is used when:", options: [{ value: "a", label: "Checking into a hotel" }, { value: "b", label: "Asking for directions" }], correctAnswer: "a", explanation: "I have a reservation." },
    { id: "travel-q3", question: "'Siga recto' means:", options: [{ value: "a", label: "Go straight" }, { value: "b", label: "Turn right" }], correctAnswer: "a", explanation: "recto = straight." },
    { id: "travel-q4", question: "At a pharmacy, 'Necesito algo para el dolor de cabeza' means:", options: [{ value: "a", label: "I need something for a headache" }, { value: "b", label: "I need a prescription" }], correctAnswer: "a", explanation: "dolor de cabeza = headache." },
    { id: "travel-q5", question: "'¿Podría traer una toalla extra?' is:", options: [{ value: "a", label: "A polite hotel request" }, { value: "b", label: "An emergency phrase" }], correctAnswer: "a", explanation: "Could you bring an extra towel?" },
    { id: "travel-q6", question: "'Gire a la derecha' means:", options: [{ value: "a", label: "Turn right" }, { value: "b", label: "Turn left" }], correctAnswer: "a", explanation: "derecha = right." },
    { id: "travel-q7", question: "For emergencies in most Spanish-speaking countries, you dial:", options: [{ value: "a", label: "112 or 911" }, { value: "b", label: "555" }], correctAnswer: "a", explanation: "112/911 for emergencies." },
    { id: "travel-q8", question: "'¿Dónde reclamo mi equipaje?' means:", options: [{ value: "a", label: "Where do I claim my luggage?" }, { value: "b", label: "Where is the hotel?" }], correctAnswer: "a", explanation: "equipaje = luggage." },
    { id: "travel-q9", question: "'Quisiera una habitación con vista al mar' means:", options: [{ value: "a", label: "I would like a room with a sea view" }, { value: "b", label: "I need a taxi" }], correctAnswer: "a", explanation: "habitación = room, vista al mar = sea view." },
    { id: "travel-q10", question: "'¿Está cerca o lejos?' means:", options: [{ value: "a", label: "Is it near or far?" }, { value: "b", label: "Where is it?" }], correctAnswer: "a", explanation: "cerca = near, lejos = far." },
  ],
};
