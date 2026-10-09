/*
  Everything editable lives here.

  Add a photo: drop "<id>-800.jpg" and "<id>-2000.jpg" into images/photography/,
  then add a line below with its pixel size (w, h) from the 2000px version.

  Add project screenshots: put them in images/projects/<project-id>/ and list
  them under that project's "media". The first image is also used as the
  hover preview unless "preview" is set.

  "did" is an optional list of bullet points describing what you built.
*/

window.SITE = {
  photos: [
    { id: "eagle", series: "Alaska", w: 2000, h: 1333, caption: "Bald eagle over the treeline, Juneau", alt: "A juvenile bald eagle flying over a dark line of spruce under a grey sky" },
    { id: "falls", series: "Alaska", w: 2000, h: 1333, caption: "Nugget Falls, Mendenhall Lake, Juneau", alt: "A wide waterfall pouring down a forested cliff onto a beach, a person in blue walking below" },
    { id: "totem", series: "Alaska", w: 1596, h: 2000, caption: "Raven on a totem pole, Juneau", alt: "A raven perched on the carved beak of a painted totem pole against a blue sky" },
    { id: "channel", series: "Alaska", w: 2000, h: 1333, caption: "Gastineau Channel, Juneau", alt: "A cruise ship and a ferry in a channel between forested mountains, snowy peaks beyond" },
    { id: "jay", series: "Alaska", w: 2000, h: 1333, caption: "Steller's jay", alt: "A Steller's jay perched on a branch among green leaves" },

    { id: "garda", series: "Italy", w: 2000, h: 1500, caption: "Lake Garda from Monte Baldo, 2026", alt: "A hiker on a grassy slope high above Lake Garda, mountains across the water" },
    { id: "vineyard", series: "Italy", w: 1500, h: 2000, caption: "Villa and vineyard, Veneto", alt: "A grass path between vineyard rows leading to a villa below a mountain" },
    { id: "bassano", series: "Italy", w: 2000, h: 1500, caption: "Ponte degli Alpini, Bassano del Grappa", alt: "A red covered wooden bridge over a river, a hillside town and mountains behind" },

    { id: "gulf-sunset", series: "Gulf coast", w: 2000, h: 1500, caption: "Sunset over the beach, Florida, 2025", alt: "Aerial view of a long beach and calm sea under a pink and orange sunset sky" },
    { id: "parasail", series: "Gulf coast", w: 2000, h: 1500, caption: "Parasail from above, Florida, 2025", alt: "Aerial view of a boat towing a parasail across turquoise water along a beach" },

    { id: "skyline", series: "New York", w: 2000, h: 1333, caption: "Midtown at dusk", alt: "The Midtown Manhattan skyline silhouetted against a dusk sky" }
  ],

  // Books in the "Currently reading" stack on the homepage. Add or remove lines as you go.
  // Spine colors rotate automatically; add color: "#hex" to a book to pick one yourself.
  reading: [
    { title: "The Myth of Sisyphus", author: "Albert Camus" },
    { title: "Outliers", author: "Malcolm Gladwell" }
  ],

  // Photos shown in the strip on the homepage, in order.
  homeStrip: ["bassano", "jay", "parasail", "totem", "skyline"],

  // The blurred photo at the end of the homepage strip that links to the Photography page.
  stripMore: "gulf-sunset",

  // Projects shown on the homepage, in order.
  featured: ["cad-to-mesh", "robin", "google-it"],

  projects: [
    {
      id: "cad-to-mesh",
      dates: "May 2026 – Present",
      title: "CAD-to-Mesh Agent",
      context: "Sun Research Group, Columbia University",
      summary: "Automated CAD-to-simulation-ready finite element mesh generation",
      stack: "Python, Gmsh, Open3D, AI Agents",
      body: [],
      links: [{ label: "GitHub", href: "https://github.com/goatchan28/CADtoMesh_Agent" }],
      preview: "images/projects/cad-to-mesh/wireframe.jpg",
      media: [
        { type: "image", src: "images/projects/cad-to-mesh/point-cloud.jpg", alt: "A point cloud of a walking cat shown in a 3D viewer", caption: "Input point cloud" },
        { type: "image", src: "images/projects/cad-to-mesh/wireframe.jpg", alt: "A green wireframe surface mesh of the cat on a black background", caption: "Reconstructed surface mesh" },
        { type: "image", src: "images/projects/cad-to-mesh/meshlab.jpg", alt: "The cat surface mesh open in MeshLab, showing 6,169 vertices and 12,338 faces", caption: "Surface mesh in MeshLab" },
        { type: "image", src: "images/projects/cad-to-mesh/tet-mesh.jpg", alt: "The cat as a shaded tetrahedral mesh with dense clusters of small elements", caption: "Volumetric mesh" },
        { type: "image", wide: true, src: "images/projects/cad-to-mesh/results.jpg", alt: "Results table: runtime, output, key result, and status for surface reconstruction, volumetric meshing, FEM readiness, and BVP adaptivity, totaling 43.42 minutes", caption: "Results by pipeline stage" }
      ]
    },
    {
      id: "whistle",
      dates: "Jul 2026 – Present",
      title: "Whistle AI",
      context: "Co-Founder & CTO",
      summary: "iOS app to detect AI-generated Instagram Reels (Submitted to YC Fall 2026)",
      stack: "SwiftUI, FastAPI, PostgreSQL, Computer Vision",
      body: [],
      links: [],
      preview: "images/projects/whistle/poster.jpg",
      media: [
        { type: "video", src: "video/whistle.mp4", poster: "images/projects/whistle/poster.jpg", caption: "The team introducing Whistle AI" }
      ]
    },
    {
      id: "robin",
      dates: "Sep 2026",
      title: "Robin Intelligence",
      context: "DNHacks 2026",
      summary: "Police bodycam software with real-time facial recognition and background check retrieval",
      stack: "Python, OpenCV, Clearview AI, Supabase",
      body: [],
      links: [
        { label: "GitHub", href: "https://github.com/goatchan28/robin_database" },
        { label: "Live demo", href: "https://robindatabase.vercel.app" }
      ],
      media: []
    },
    {
      id: "knocknock",
      dates: "Jan 2026 – May 2026",
      title: "Knocknock",
      context: "Campus Startup",
      summary: "Peer-to-peer borrowing and lending app for Columbia students",
      stack: "Flutter, Firebase",
      body: [],
      links: [
        { label: "Website", href: "https://www.knocknock.cc" },
        { label: "GitHub", href: "https://github.com/goatchan28/theknocknock" }
      ],
      preview: "images/projects/knocknock/poster.jpg",
      media: [
        { type: "video", src: "video/knocknock.mp4", poster: "images/projects/knocknock/poster.jpg", caption: "Knocknock pitch and demo" }
      ]
    },
    {
      id: "google-it",
      dates: "Nov 2025",
      title: "Google It",
      context: "MakeCU 2025 · Best Use of Computer Vision",
      summary: "Autonomous Raspberry Pi robot using computer vision and ultrasonic sensors to navigate its environment",
      stack: "Python, Raspberry Pi, OpenCV, PID",
      body: [],
      links: [{ label: "Devpost", href: "https://devpost.com/software/google-it-9y6lre" }],
      preview: "images/projects/google-it/robot.jpg",
      media: [
        { type: "image", src: "images/projects/google-it/robot.jpg", alt: "The Google It robot on a workbench: a Raspberry Pi, webcam, ultrasonic sensor, and wiring on a three-wheeled chassis", caption: "The robot" },
        { type: "image", src: "images/projects/google-it/building.jpg", alt: "Teammates wiring components and coding on laptops at a lab bench", caption: "Building at MakeCU" },
        { type: "image", src: "images/projects/google-it/award.jpg", alt: "MakeCU 2025 certificate for Best Use of Computer Vision awarded to Google It, next to a boxed webcam prize", caption: "Best Use of Computer Vision" },
        { type: "image", src: "images/projects/google-it/team.jpg", alt: "The four teammates smiling and giving thumbs up and peace signs at the hackathon", caption: "The team" }
      ]
    },
    {
      id: "furiva",
      dates: "Jan 2025 – Jun 2025",
      title: "Furiva",
      context: "Independent Project",
      summary: "iOS pet health app with meal tracking, barcode scanning, and AI-powered nutrition analysis",
      stack: "Flutter, Firebase, Gemini API",
      body: [],
      links: [{ label: "GitHub", href: "https://github.com/goatchan28/pet_health_ai" }],
      media: []
    },
    {
      id: "orpheus",
      dates: "Oct 2024 – Jan 2025",
      title: "Orpheus Environmental",
      context: "Conrad Challenge",
      summary: "Solar-powered wildlife monitoring system using machine learning to identify animal species through sound",
      stack: "Machine Learning, Audio Processing",
      body: [],
      links: [
        { label: "Website", href: "https://orpheusenvironmental.wixsite.com/home" },
        { label: "GitHub", href: "https://github.com/goatchan28/conrad_challenge" }
      ],
      preview: "images/projects/orpheus/poster.jpg",
      media: [
        { type: "video", src: "video/orpheus.mp4", poster: "images/projects/orpheus/poster.jpg", caption: "3D model overview of the listening unit" }
      ]
    }
  ]
};
