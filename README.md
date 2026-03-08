# <img src="public/logo.svg" width="32" height="32" align="center" /> Flickzo - AI Cinematic Video Explorer

Flickzo is a powerful platform that leverages advanced AI to transform text and ideas into professional cinematic videos. Built with modern web technologies, it automates the entire video creation process—from scriptwriting and voice generation to visual synthesis and video editing.

## � App Demo

<p align="center">
  <img src="public/dark-demo.png" alt="Flickzo Dark Mode" width="100%">
</p>
<p align="center">
  <em>Dark Mode Interface</em>
</p>

<p align="center">
  <img src="public/light-demo.png" alt="Flickzo Light Mode" width="100%">
</p>
<p align="center">
  <em>Light Mode Interface</em>
</p>

## �🚀 Features

- **AI Script Generation**: Automatically generates engaging video scripts based on user topics using LLMs.
- **Lifelike Voiceovers**: Converts text to speech using high-quality AI audio generation (Deepgram).
- **Visual Synthesis**: Generates relevant imagery to match the script content.
- **Automated Video Editing**: Stitches together audio, images, and captions into a polished video using Remotion.
- **Background Processing**: Handles complex generation tasks asynchronously using Inngest.
- **Responsive Design**: A beautiful, modern interface built with Tailwind CSS and Next.js.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Video Engine**: [Remotion](https://www.remotion.dev/)
- **Background Jobs**: [Inngest](https://www.inngest.com/)
- **AI Services**:
  - **LLM (Script)**: [GLM-4t](https://chatglm.cn/chatglm4)
  - **Image Generation**: [Flux Klein](https://blackforestlabs.ai/#get-flux)
  - **Captions Generation**: [Nova-3](https://deepgram.com/)
  - **Audio**: [Aura-2 by Deepgram](https://deepgram.com/)
  - **Storage/Media**: [Cloudinary](https://cloudinary.com/)

## 🏗️ Architecture

```mermaid
graph TD
    User([User]) -->|1. Enter Topic| Client[Next.js Client]
    Client -->|2. Request Video Generation| API[Next.js API Routes]
    API -->|3. Trigger Event| Inngest[Inngest Event Bus]

    subgraph "Background Workers"
        Inngest -->|4. Generate Script| Workflow[Video Creation Workflow]
        Workflow -->|5a. Call LLM| LLM[GLM-4t]
        Workflow -->|5b. Generate Audio| Audio[Aura-2]
        Workflow -->|5c. Generate Captions| Text[Nova-3]
        Workflow -->|5d. Generate Images| ImgGen[Flux Klein]
        Workflow -->|6. Render Video| Remotion[Remotion Engine]
    end

    Remotion -->|7. Upload Video| Cloudinary[Cloudinary]
    Workflow -->|8. Update Status| DB[(Postgres DB)]

    Client -.->|9. Poll Status| DB
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v18+)
- Bun (recommended) or npm/pnpm
- Database running locally using Docker or PostgreSQL
- Valid Cloudflare AI configurations

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/lwshakib/flickzo-short-video-generator.git
    cd flickzo-short-video-generator
    ```

2.  **Install dependencies**

    ```bash
    bun install
    ```

3.  **Environment Setup**

    Create a `.env` file based on `.env.example` and populate it with your keys:

    ```bash
    DATABASE_URL="postgresql://..."
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
    CLOUDFLARE_API_KEY="..."
    # Add other necessary keys
    ```

4.  **Database Setup**

    ```bash
    bun prisma generate
    bun prisma db push
    ```

5.  **Run the Development Server**

    ```bash
    bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

6.  **Run Inngest Dev Server** (for background jobs)

    ```bash
    bun x inngest-cli@latest dev
    ```

## 🤝 Contributing

We welcome contributions! Please check out our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**lwshakib**

- GitHub: [@lwshakib](https://github.com/lwshakib)
