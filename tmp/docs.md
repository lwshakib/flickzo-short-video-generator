# Text generation

The Gemini API can generate text output from text, images, video, and audio
inputs.

Here's a basic example:

### Python

    from google import genai

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="How does AI work?"
    )
    print(response.text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "How does AI work?",
      });
      console.log(response.text);
    }

    await main();

### Go

    package main

    import (
      "context"
      "fmt"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-3-flash-preview",
          genai.Text("Explain how AI works in a few words"),
          nil,
      )

      fmt.Println(result.Text())
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentResponse;

    public class GenerateContentWithTextInput {
      public static void main(String[] args) {

        Client client = new Client();

        GenerateContentResponse response =
            client.models.generateContent("gemini-3-flash-preview", "How does AI work?", null);

        System.out.println(response.text());
      }
    }

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [
          {
            "parts": [
              {
                "text": "How does AI work?"
              }
            ]
          }
        ]
      }'

### Apps Script

    // See https://developers.google.com/apps-script/guides/properties
    // for instructions on how to set the API key.
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

    function main() {
      const payload = {
        contents: [
          {
            parts: [
              { text: 'How AI does work?' },
            ],
          },
        ],
      };

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';
      const options = {
        method: 'POST',
        contentType: 'application/json',
        headers: {
          'x-goog-api-key': apiKey,
        },
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      const data = JSON.parse(response);
      const content = data['candidates'][0]['content']['parts'][0]['text'];
      console.log(content);
    }

## Thinking with Gemini

Gemini models often have ["thinking"](https://ai.google.dev/gemini-api/docs/thinking) enabled by default
which allows the model to reason before responding to a request.

Each model supports different thinking configurations which gives you control
over cost, latency, and intelligence. For more details, see the
[thinking guide](https://ai.google.dev/gemini-api/docs/thinking#set-budget).

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="How does AI work?",
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_level="low")
        ),
    )
    print(response.text)

### JavaScript

    import { GoogleGenAI, ThinkingLevel } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "How does AI work?",
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        }
      });
      console.log(response.text);
    }

    await main();

### Go

    package main

    import (
      "context"
      "fmt"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      thinkingLevelVal := "low"

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-3-flash-preview",
          genai.Text("How does AI work?"),
          &genai.GenerateContentConfig{
            ThinkingConfig: &genai.ThinkingConfig{
                ThinkingLevel: &thinkingLevelVal,
            },
          }
      )

      fmt.Println(result.Text())
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.ThinkingConfig;
    import com.google.genai.types.ThinkingLevel;

    public class GenerateContentWithThinkingConfig {
      public static void main(String[] args) {

        Client client = new Client();

        GenerateContentConfig config =
            GenerateContentConfig.builder()
                .thinkingConfig(ThinkingConfig.builder().thinkingLevel(new ThinkingLevel("low")))
                .build();

        GenerateContentResponse response =
            client.models.generateContent("gemini-3-flash-preview", "How does AI work?", config);

        System.out.println(response.text());
      }
    }

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [
          {
            "parts": [
              {
                "text": "How does AI work?"
              }
            ]
          }
        ],
        "generationConfig": {
          "thinkingConfig": {
            "thinkingLevel": "low"
          }
        }
      }'

### Apps Script

    // See https://developers.google.com/apps-script/guides/properties
    // for instructions on how to set the API key.
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

    function main() {
      const payload = {
        contents: [
          {
            parts: [
              { text: 'How AI does work?' },
            ],
          },
        ],
        generationConfig: {
          thinkingConfig: {
            thinkingLevel: 'low'
          }
        }
      };

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';
      const options = {
        method: 'POST',
        contentType: 'application/json',
        headers: {
          'x-goog-api-key': apiKey,
        },
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      const data = JSON.parse(response);
      const content = data['candidates'][0]['content']['parts'][0]['text'];
      console.log(content);
    }

## System instructions and other configurations

You can guide the behavior of Gemini models with system instructions. To do so,
pass a [`GenerateContentConfig`](https://ai.google.dev/api/generate-content#v1beta.GenerationConfig)
object.

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        config=types.GenerateContentConfig(
            system_instruction="You are a cat. Your name is Neko."),
        contents="Hello there"
    )

    print(response.text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Hello there",
        config: {
          systemInstruction: "You are a cat. Your name is Neko.",
        },
      });
      console.log(response.text);
    }

    await main();

### Go

    package main

    import (
      "context"
      "fmt"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      config := &genai.GenerateContentConfig{
          SystemInstruction: genai.NewContentFromText("You are a cat. Your name is Neko.", genai.RoleUser),
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-3-flash-preview",
          genai.Text("Hello there"),
          config,
      )

      fmt.Println(result.Text())
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    public class GenerateContentWithSystemInstruction {
      public static void main(String[] args) {

        Client client = new Client();

        GenerateContentConfig config =
            GenerateContentConfig.builder()
                .systemInstruction(
                    Content.fromParts(Part.fromText("You are a cat. Your name is Neko.")))
                .build();

        GenerateContentResponse response =
            client.models.generateContent("gemini-3-flash-preview", "Hello there", config);

        System.out.println(response.text());
      }
    }

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "system_instruction": {
          "parts": [
            {
              "text": "You are a cat. Your name is Neko."
            }
          ]
        },
        "contents": [
          {
            "parts": [
              {
                "text": "Hello there"
              }
            ]
          }
        ]
      }'

### Apps Script

    // See https://developers.google.com/apps-script/guides/properties
    // for instructions on how to set the API key.
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

    function main() {
      const systemInstruction = {
        parts: [{
          text: 'You are a cat. Your name is Neko.'
        }]
      };

      const payload = {
        systemInstruction,
        contents: [
          {
            parts: [
              { text: 'Hello there' },
            ],
          },
        ],
      };

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';
      const options = {
        method: 'POST',
        contentType: 'application/json',
        headers: {
          'x-goog-api-key': apiKey,
        },
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      const data = JSON.parse(response);
      const content = data['candidates'][0]['content']['parts'][0]['text'];
      console.log(content);
    }

The [`GenerateContentConfig`](https://ai.google.dev/api/generate-content#v1beta.GenerationConfig)
object also lets you override default generation parameters, such as
[temperature](https://ai.google.dev/api/generate-content#v1beta.GenerationConfig).

> [!NOTE]
> When using Gemini 3 models, we strongly recommend keeping the `temperature` at its default value of 1.0. Changing the temperature (setting it below 1.0) may lead to unexpected behavior, such as looping or degraded performance, particularly in complex mathematical or reasoning tasks.

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=["Explain how AI works"],
        config=types.GenerateContentConfig(
            temperature=0.1
        )
    )
    print(response.text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Explain how AI works",
        config: {
          temperature: 0.1,
        },
      });
      console.log(response.text);
    }

    await main();

### Go

    package main

    import (
      "context"
      "fmt"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      temp := float32(0.9)
      topP := float32(0.5)
      topK := float32(20.0)

      config := &genai.GenerateContentConfig{
        Temperature:       &temp,
        TopP:              &topP,
        TopK:              &topK,
        ResponseMIMEType:  "application/json",
      }

      result, _ := client.Models.GenerateContent(
        ctx,
        "gemini-3-flash-preview",
        genai.Text("What is the average size of a swallow?"),
        config,
      )

      fmt.Println(result.Text())
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;

    public class GenerateContentWithConfig {
      public static void main(String[] args) {

        Client client = new Client();

        GenerateContentConfig config = GenerateContentConfig.builder().temperature(0.1f).build();

        GenerateContentResponse response =
            client.models.generateContent("gemini-3-flash-preview", "Explain how AI works", config);

        System.out.println(response.text());
      }
    }

### REST

    curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [
          {
            "parts": [
              {
                "text": "Explain how AI works"
              }
            ]
          }
        ],
        "generationConfig": {
          "stopSequences": [
            "Title"
          ],
          "temperature": 1.0,
          "topP": 0.8,
          "topK": 10
        }
      }'

### Apps Script

    // See https://developers.google.com/apps-script/guides/properties
    // for instructions on how to set the API key.
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

    function main() {
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        responseFormat: { text: { mimeType: "text/plain" } },
      };

      const payload = {
        generationConfig,
        contents: [
          {
            parts: [
              { text: 'Explain how AI works in a few words' },
            ],
          },
        ],
      };

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';
      const options = {
        method: 'POST',
        contentType: 'application/json',
        headers: {
          'x-goog-api-key': apiKey,
        },
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      const data = JSON.parse(response);
      const content = data['candidates'][0]['content']['parts'][0]['text'];
      console.log(content);
    }

Refer to the [`GenerateContentConfig`](https://ai.google.dev/api/generate-content#v1beta.GenerationConfig)
in our API reference for a complete list of configurable parameters and their
descriptions.

## Multimodal inputs

The Gemini API supports multimodal inputs, allowing you to combine text with
media files. The following example demonstrates providing an image:

### Python

    from PIL import Image
    from google import genai

    client = genai.Client()

    image = Image.open("/path/to/organ.png")
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[image, "Tell me about this instrument"]
    )
    print(response.text)

### JavaScript

    import {
      GoogleGenAI,
      createUserContent,
      createPartFromUri,
    } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const image = await ai.files.upload({
        file: "/path/to/organ.png",
      });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          createUserContent([
            "Tell me about this instrument",
            createPartFromUri(image.uri, image.mimeType),
          ]),
        ],
      });
      console.log(response.text);
    }

    await main();

### Go

    package main

    import (
      "context"
      "fmt"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      imagePath := "/path/to/organ.jpg"
      imgData, _ := os.ReadFile(imagePath)

      parts := []*genai.Part{
          genai.NewPartFromText("Tell me about this instrument"),
          &genai.Part{
              InlineData: &genai.Blob{
                  MIMEType: "image/jpeg",
                  Data:     imgData,
              },
          },
      }

      contents := []*genai.Content{
          genai.NewContentFromParts(parts, genai.RoleUser),
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-3-flash-preview",
          contents,
          nil,
      )

      fmt.Println(result.Text())
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.Content;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    public class GenerateContentWithMultiModalInputs {
      public static void main(String[] args) {

        Client client = new Client();

        Content content =
          Content.fromParts(
              Part.fromText("Tell me about this instrument"),
              Part.fromUri("/path/to/organ.jpg", "image/jpeg"));

        GenerateContentResponse response =
            client.models.generateContent("gemini-3-flash-preview", content, null);

        System.out.println(response.text());
      }
    }

### REST

    # Use a temporary file to hold the base64 encoded image data
    TEMP_B64=$(mktemp)
    trap 'rm -f "$TEMP_B64"' EXIT
    base64 $B64FLAGS $IMG_PATH > "$TEMP_B64"

    # Use a temporary file to hold the JSON payload
    TEMP_JSON=$(mktemp)
    trap 'rm -f "$TEMP_JSON"' EXIT

    cat > "$TEMP_JSON" << EOF
    {
      "contents": [
        {
          "parts": [
            {
              "text": "Tell me about this instrument"
            },
            {
              "inline_data": {
                "mime_type": "image/jpeg",
                "data": "$(cat "$TEMP_B64")"
              }
            }
          ]
        }
      ]
    }
    EOF

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d "@$TEMP_JSON"

### Apps Script

    // See https://developers.google.com/apps-script/guides/properties
    // for instructions on how to set the API key.
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

    function main() {
      const imageUrl = 'http://image/url';
      const image = getImageData(imageUrl);
      const payload = {
        contents: [
          {
            parts: [
              { image },
              { text: 'Tell me about this instrument' },
            ],
          },
        ],
      };

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';
      const options = {
        method: 'POST',
        contentType: 'application/json',
        headers: {
          'x-goog-api-key': apiKey,
        },
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      const data = JSON.parse(response);
      const content = data['candidates'][0]['content']['parts'][0]['text'];
      console.log(content);
    }

    function getImageData(url) {
      const blob = UrlFetchApp.fetch(url).getBlob();

      return {
        mimeType: blob.getContentType(),
        data: Utilities.base64Encode(blob.getBytes())
      };
    }

For alternative methods of providing images and more advanced image processing,
see our [image understanding guide](https://ai.google.dev/gemini-api/docs/image-understanding).
The API also supports [document](https://ai.google.dev/gemini-api/docs/document-processing), [video](https://ai.google.dev/gemini-api/docs/video-understanding), and [audio](https://ai.google.dev/gemini-api/docs/audio)
inputs and understanding.

## Streaming responses

By default, the model returns a response only after the entire generation
process is complete.

For more fluid interactions, use streaming to receive [`GenerateContentResponse`](https://ai.google.dev/api/generate-content#v1beta.GenerateContentResponse) instances incrementally
as they're generated.

### Python

    from google import genai

    client = genai.Client()

    response = client.models.generate_content_stream(
        model="gemini-3-flash-preview",
        contents=["Explain how AI works"]
    )
    for chunk in response:
        print(chunk.text, end="")

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const response = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: "Explain how AI works",
      });

      for await (const chunk of response) {
        console.log(chunk.text);
      }
    }

    await main();

### Go

    package main

    import (
      "context"
      "fmt"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      stream := client.Models.GenerateContentStream(
          ctx,
          "gemini-3-flash-preview",
          genai.Text("Write a story about a magic backpack."),
          nil,
      )

      for chunk, _ := range stream {
          part := chunk.Candidates[0].Content.Parts[0]
          fmt.Print(part.Text)
      }
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.ResponseStream;
    import com.google.genai.types.GenerateContentResponse;

    public class GenerateContentStream {
      public static void main(String[] args) {

        Client client = new Client();

        ResponseStream<GenerateContentResponse> responseStream =
          client.models.generateContentStream(
              "gemini-3-flash-preview", "Write a story about a magic backpack.", null);

        for (GenerateContentResponse res : responseStream) {
          System.out.print(res.text());
        }

        // To save resources and avoid connection leaks, it is recommended to close the response
        // stream after consumption (or using try block to get the response stream).
        responseStream.close();
      }
    }

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:streamGenerateContent?alt=sse" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      --no-buffer \
      -d '{
        "contents": [
          {
            "parts": [
              {
                "text": "Explain how AI works"
              }
            ]
          }
        ]
      }'

### Apps Script

    // See https://developers.google.com/apps-script/guides/properties
    // for instructions on how to set the API key.
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

    function main() {
      const payload = {
        contents: [
          {
            parts: [
              { text: 'Explain how AI works' },
            ],
          },
        ],
      };

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:streamGenerateContent';
      const options = {
        method: 'POST',
        contentType: 'application/json',
        headers: {
          'x-goog-api-key': apiKey,
        },
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      const data = JSON.parse(response);
      const content = data['candidates'][0]['content']['parts'][0]['text'];
      console.log(content);
    }

## Multi-turn conversations (chat)

Our SDKs provide functionality to collect multiple rounds of prompts and
responses into a chat, giving you an easy way to keep track of the conversation
history.

> [!NOTE]
> **Note:** Chat functionality is only implemented as part of the SDKs. Behind the scenes, it still uses the [`generateContent`](https://ai.google.dev/api/generate-content#method:-models.generatecontent) API. For multi-turn conversations, the full conversation history is sent to the model with each follow-up turn.

### Python

    from google import genai

    client = genai.Client()
    chat = client.chats.create(model="gemini-3-flash-preview")

    response = chat.send_message("I have 2 dogs in my house.")
    print(response.text)

    response = chat.send_message("How many paws are in my house?")
    print(response.text)

    for message in chat.get_history():
        print(f'role - {message.role}',end=": ")
        print(message.parts[0].text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        history: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
          },
        ],
      });

      const response1 = await chat.sendMessage({
        message: "I have 2 dogs in my house.",
      });
      console.log("Chat response 1:", response1.text);

      const response2 = await chat.sendMessage({
        message: "How many paws are in my house?",
      });
      console.log("Chat response 2:", response2.text);
    }

    await main();

### Go

    package main

    import (
      "context"
      "fmt"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      history := []*genai.Content{
          genai.NewContentFromText("Hi nice to meet you! I have 2 dogs in my house.", genai.RoleUser),
          genai.NewContentFromText("Great to meet you. What would you like to know?", genai.RoleModel),
      }

      chat, _ := client.Chats.Create(ctx, "gemini-3-flash-preview", nil, history)
      res, _ := chat.SendMessage(ctx, genai.Part{Text: "How many paws are in my house?"})

      if len(res.Candidates) > 0 {
          fmt.Println(res.Candidates[0].Content.Parts[0].Text)
      }
    }

### Java

    import com.google.genai.Chat;
    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentResponse;

    public class MultiTurnConversation {
      public static void main(String[] args) {

        Client client = new Client();
        Chat chatSession = client.chats.create("gemini-3-flash-preview");

        GenerateContentResponse response =
            chatSession.sendMessage("I have 2 dogs in my house.");
        System.out.println("First response: " + response.text());

        response = chatSession.sendMessage("How many paws are in my house?");
        System.out.println("Second response: " + response.text());

        // Get the history of the chat session.
        // Passing 'true' to getHistory() returns the curated history, which excludes
        // empty or invalid parts.
        // Passing 'false' here would return the comprehensive history, including
        // empty or invalid parts.
        ImmutableList<Content> history = chatSession.getHistory(true);
        System.out.println("History: " + history);
      }
    }

### REST

    curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [
          {
            "role": "user",
            "parts": [
              {
                "text": "Hello"
              }
            ]
          },
          {
            "role": "model",
            "parts": [
              {
                "text": "Great to meet you. What would you like to know?"
              }
            ]
          },
          {
            "role": "user",
            "parts": [
              {
                "text": "I have two dogs in my house. How many paws are in my house?"
              }
            ]
          }
        ]
      }'

### Apps Script

    // See https://developers.google.com/apps-script/guides/properties
    // for instructions on how to set the API key.
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

    function main() {
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: 'Hello' },
            ],
          },
          {
            role: 'model',
            parts: [
              { text: 'Great to meet you. What would you like to know?' },
            ],
          },
          {
            role: 'user',
            parts: [
              { text: 'I have two dogs in my house. How many paws are in my house?' },
            ],
          },
        ],
      };

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';
      const options = {
        method: 'POST',
        contentType: 'application/json',
        headers: {
          'x-goog-api-key': apiKey,
        },
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      const data = JSON.parse(response);
      const content = data['candidates'][0]['content']['parts'][0]['text'];
      console.log(content);
    }

Streaming can also be used for multi-turn conversations.

### Python

    from google import genai

    client = genai.Client()
    chat = client.chats.create(model="gemini-3-flash-preview")

    response = chat.send_message_stream("I have 2 dogs in my house.")
    for chunk in response:
        print(chunk.text, end="")

    response = chat.send_message_stream("How many paws are in my house?")
    for chunk in response:
        print(chunk.text, end="")

    for message in chat.get_history():
        print(f'role - {message.role}', end=": ")
        print(message.parts[0].text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        history: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
          },
        ],
      });

      const stream1 = await chat.sendMessageStream({
        message: "I have 2 dogs in my house.",
      });
      for await (const chunk of stream1) {
        console.log(chunk.text);
        console.log("_".repeat(80));
      }

      const stream2 = await chat.sendMessageStream({
        message: "How many paws are in my house?",
      });
      for await (const chunk of stream2) {
        console.log(chunk.text);
        console.log("_".repeat(80));
      }
    }

    await main();

### Go

    package main

    import (
      "context"
      "fmt"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      history := []*genai.Content{
          genai.NewContentFromText("Hi nice to meet you! I have 2 dogs in my house.", genai.RoleUser),
          genai.NewContentFromText("Great to meet you. What would you like to know?", genai.RoleModel),
      }

      chat, _ := client.Chats.Create(ctx, "gemini-3-flash-preview", nil, history)
      stream := chat.SendMessageStream(ctx, genai.Part{Text: "How many paws are in my house?"})

      for chunk, _ := range stream {
          part := chunk.Candidates[0].Content.Parts[0]
          fmt.Print(part.Text)
      }
    }

### Java

    import com.google.genai.Chat;
    import com.google.genai.Client;
    import com.google.genai.ResponseStream;
    import com.google.genai.types.GenerateContentResponse;

    public class MultiTurnConversationWithStreaming {
      public static void main(String[] args) {

        Client client = new Client();
        Chat chatSession = client.chats.create("gemini-3-flash-preview");

        ResponseStream<GenerateContentResponse> responseStream =
            chatSession.sendMessageStream("I have 2 dogs in my house.", null);

        for (GenerateContentResponse response : responseStream) {
          System.out.print(response.text());
        }

        responseStream = chatSession.sendMessageStream("How many paws are in my house?", null);

        for (GenerateContentResponse response : responseStream) {
          System.out.print(response.text());
        }

        // Get the history of the chat session. History is added after the stream
        // is consumed and includes the aggregated response from the stream.
        System.out.println("History: " + chatSession.getHistory(false));
      }
    }

### REST

    curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:streamGenerateContent?alt=sse \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [
          {
            "role": "user",
            "parts": [
              {
                "text": "Hello"
              }
            ]
          },
          {
            "role": "model",
            "parts": [
              {
                "text": "Great to meet you. What would you like to know?"
              }
            ]
          },
          {
            "role": "user",
            "parts": [
              {
                "text": "I have two dogs in my house. How many paws are in my house?"
              }
            ]
          }
        ]
      }'

### Apps Script

    // See https://developers.google.com/apps-script/guides/properties
    // for instructions on how to set the API key.
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

    function main() {
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: 'Hello' },
            ],
          },
          {
            role: 'model',
            parts: [
              { text: 'Great to meet you. What would you like to know?' },
            ],
          },
          {
            role: 'user',
            parts: [
              { text: 'I have two dogs in my house. How many paws are in my house?' },
            ],
          },
        ],
      };

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:streamGenerateContent';
      const options = {
        method: 'POST',
        contentType: 'application/json',
        headers: {
          'x-goog-api-key': apiKey,
        },
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      const data = JSON.parse(response);
      const content = data['candidates'][0]['content']['parts'][0]['text'];
      console.log(content);
    }

## Prompting tips

Consult our [prompt engineering guide](https://ai.google.dev/gemini/docs/prompting-strategies) for
suggestions on getting the most out of Gemini.

## What's next

- Try [Gemini in Google AI Studio](https://aistudio.google.com).
- Experiment with [structured outputs](https://ai.google.dev/gemini-api/docs/structured-output) for JSON-like responses.
- Explore Gemini's [image](https://ai.google.dev/gemini-api/docs/image-understanding), [video](https://ai.google.dev/gemini-api/docs/video-understanding), [audio](https://ai.google.dev/gemini-api/docs/audio) and [document](https://ai.google.dev/gemini-api/docs/document-processing) understanding capabilities.
- Learn about multimodal [file prompting strategies](https://ai.google.dev/gemini-api/docs/files#prompt-guide).


# Text generation

> [!NOTE]
> **Note** : This version of the page covers the new [Interactions API](https://ai.google.dev/gemini-api/docs/interactions), which is currently in Beta.  
> For stable production deployments, we recommend you continue to use the `generateContent` API. You can use the toggle on this page to switch between the versions.

The Gemini API can generate text output from text, images, video, and audio
inputs.

Here's a basic example:

### Python

    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="How does AI work?"
    )
    print(interaction.steps[-1].content[0].text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const interaction = await ai.interactions.create({
        model: "gemini-3-flash-preview",
        input: "How does AI work?",
      });
      console.log(interaction.steps.at(-1).content[0].text);
    }

    await main();

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3-flash-preview",
        "input": "How does AI work?"
      }'

## Thinking with Gemini

Gemini models often have ["thinking"](https://ai.google.dev/gemini-api/docs/interactions/thinking)
enabled by default which allows the model to reason before responding to a
request.

Each model supports different thinking configurations which gives you control
over cost, latency, and intelligence. For more details, see the
[thinking guide](https://ai.google.dev/gemini-api/docs/interactions/thinking#set-budget).

### Python

    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="How does AI work?",
        generation_config={
            "thinking_level": "low"
        }
    )
    print(interaction.steps[-1].content[0].text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const interaction = await ai.interactions.create({
        model: "gemini-3-flash-preview",
        input: "How does AI work?",
        generation_config: {
          thinking_level: "low",
        },
      });
      console.log(interaction.steps.at(-1).content[0].text);
    }

    await main();

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3-flash-preview",
        "input": "How does AI work?",
        "generation_config": {
          "thinking_level": "low"
        }
      }'

## System instructions and other configurations

You can guide the behavior of Gemini models with system instructions. Pass
a `system_instruction` parameter to configure the model's behavior.

### Python

    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        system_instruction="You are a cat. Your name is Neko.",
        input="Hello there"
    )

    print(interaction.steps[-1].content[0].text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const interaction = await ai.interactions.create({
        model: "gemini-3-flash-preview",
        input: "Hello there",
        system_instruction: "You are a cat. Your name is Neko.",
      });
      console.log(interaction.steps.at(-1).content[0].text);
    }

    await main();

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3-flash-preview",
        "system_instruction": "You are a cat. Your name is Neko.",
        "input": "Hello there"
      }'

You can also override default generation parameters, such as
temperature, using the `generation_config` parameter.

### Python

    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Explain how AI works",
        generation_config={
            "temperature": 0.1
        }
    )
    print(interaction.steps[-1].content[0].text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const interaction = await ai.interactions.create({
        model: "gemini-3-flash-preview",
        input: "Explain how AI works",
        generation_config: {
          temperature: 0.1,
        },
      });
      console.log(interaction.steps.at(-1).content[0].text);
    }

    await main();

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3-flash-preview",
        "input": "Explain how AI works",
        "generation_config": {
          "temperature": 0.1
        }
      }'

Refer to the [Interactions API reference](https://ai.google.dev/api/interactions-api)
for a complete list of configurable parameters and their
descriptions.

## Multimodal inputs

The Gemini API supports multimodal inputs, allowing you to combine text with
media files. The following example demonstrates providing an image:

### Python

    from google import genai

    client = genai.Client()

    uploaded_file = client.files.upload(file="path/to/organ.jpg")

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input=[
            {"type": "text", "text": "Tell me about this instrument"},
            {
                "type": "image",
                "uri": uploaded_file.uri,
                "mime_type": uploaded_file.mime_type
            }
        ]
    )
    print(interaction.steps[-1].content[0].text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const uploadedFile = await ai.files.upload({
        file: "path/to/organ.jpg",
        config: { mimeType: "image/jpeg" }
      });

      const interaction = await ai.interactions.create({
        model: "gemini-3-flash-preview",
        input: [
          {type: "text", text: "Tell me about this instrument"},
          {
            type: "image",
            uri: uploadedFile.uri,
            mimeType: uploadedFile.mimeType
          }
        ],
      });
      console.log(interaction.steps.at(-1).content[0].text);
    }

    await main();

### REST

    # First upload the file using the Files API, then use the URI:
    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3-flash-preview",
        "input": [
          {"type": "text", "text": "Tell me about this instrument"},
          {
            "type": "image",
            "uri": "YOUR_FILE_URI",
            "mime_type": "image/jpeg"
          }
        ]
      }'

For alternative methods of providing images and more advanced image processing,
see our [image understanding guide](https://ai.google.dev/gemini-api/docs/interactions/image-understanding).
The API also supports [document](https://ai.google.dev/gemini-api/docs/interactions/document-processing), [video](https://ai.google.dev/gemini-api/docs/interactions/video-understanding), and
[audio](https://ai.google.dev/gemini-api/docs/interactions/audio) inputs and understanding.

## Streaming responses

By default, the model returns a response only after the entire generation
process is complete.

For more fluid interactions, use streaming to handle response chunks
as they're generated.

### Python

    from google import genai

    client = genai.Client()

    stream = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Explain how AI works",
        stream=True
    )
    for event in stream:
        if event.event_type == "step.delta":
            if event.delta.type == "text":
                print(event.delta.text, end="")

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const stream = await ai.interactions.create({
        model: "gemini-3-flash-preview",
        input: "Explain how AI works",
        stream: true,
      });

      for await (const event of stream) {
        if (event.type === "step.delta") {
          if (event.delta.type === "text") {
            process.stdout.write(event.delta.text);
          }
        }
      }
    }

    await main();

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      --no-buffer \
      -d '{
        "model": "gemini-3-flash-preview",
        "input": "Explain how AI works",
        "stream": true
      }'

## Multi-turn conversations

The Interactions API supports multi-turn conversations by chaining interactions
together using `previous_interaction_id`. Each turn is a separate interaction,
and the API automatically manages conversation history.

> [!NOTE]
> **Note:** Unlike other APIs where you might manage conversation history manually, the Interactions API handles conversation state server-side. You pass the `id` from the previous interaction to continue the conversation.

### Python

    from google import genai

    client = genai.Client()

    interaction1 = client.interactions.create(
        model="gemini-3-flash-preview",
        input="I have 2 dogs in my house.",
    )
    print(interaction1.steps[-1].content[0].text)

    interaction2 = client.interactions.create(
        model="gemini-3-flash-preview",
        input="How many paws are in my house?",
        previous_interaction_id=interaction1.id,
    )
    print(interaction2.steps[-1].content[0].text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const interaction1 = await ai.interactions.create({
        model: "gemini-3-flash-preview",
        input: "I have 2 dogs in my house.",
      });
      console.log("Response 1:", interaction1.steps.at(-1).content[0].text);

      const interaction2 = await ai.interactions.create({
        model: "gemini-3-flash-preview",
        input: "How many paws are in my house?",
        previousInteractionId: interaction1.id,
      });
      console.log("Response 2:", interaction2.steps.at(-1).content[0].text);
    }

    await main();

### REST

    RESPONSE1=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3-flash-preview",
        "input": "I have 2 dogs in my house."
      }')

    INTERACTION_ID=$(echo "$RESPONSE1" | jq -r '.name')

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3-flash-preview",
        "input": "I have two dogs in my house. How many paws are in my house?",
        "previous_interaction_id": "'$INTERACTION_ID'"
      }'

Streaming can also be used for multi-turn conversations by combining
`previous_interaction_id` with the streaming methods.

### Python

    from google import genai

    client = genai.Client()

    interaction1 = client.interactions.create(
        model="gemini-3-flash-preview",
        input="I have 2 dogs in my house.",
    )
    print(interaction1.steps[-1].content[0].text)

    stream = client.interactions.create(
        model="gemini-3-flash-preview",
        input="How many paws are in my house?",
        previous_interaction_id=interaction1.id,
        stream=True
    )
    for event in stream:
        if event.event_type == "step.delta":
            if event.delta.type == "text":
                print(event.delta.text, end="")

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const interaction1 = await ai.interactions.create({
        model: "gemini-3-flash-preview",
        input: "I have 2 dogs in my house.",
      });
      console.log("Response 1:", interaction1.steps.at(-1).content[0].text);

      const stream = await ai.interactions.create({
        model: "gemini-3-flash-preview",
        input: "How many paws are in my house?",
        previousInteractionId: interaction1.id,
        stream: true,
      });
      for await (const event of stream) {
        if (event.type === "step.delta") {
          if (event.delta.type === "text") {
            process.stdout.write(event.delta.text);
          }
        }
      }
    }

    await main();

### REST

    RESPONSE1=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3-flash-preview",
        "input": "I have 2 dogs in my house."
      }')
    INTERACTION_ID=$(echo "$RESPONSE1" | jq -r '.name')

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      --no-buffer \
      -d '{
        "model": "gemini-3-flash-preview",
        "input": "How many paws are in my house?",
        "previous_interaction_id": "'$INTERACTION_ID'",
        "stream": true
      }'

## Prompting tips

Consult our [prompt engineering guide](https://ai.google.dev/gemini/docs/prompting-strategies) for
suggestions on getting the most out of Gemini.

## What's next

- Try [Gemini in Google AI Studio](https://aistudio.google.com).
- Experiment with [structured outputs](https://ai.google.dev/gemini-api/docs/interactions/structured-output) for JSON-like responses.
- Explore Gemini's [image](https://ai.google.dev/gemini-api/docs/interactions/image-understanding), [video](https://ai.google.dev/gemini-api/docs/interactions/video-understanding), [audio](https://ai.google.dev/gemini-api/docs/interactions/audio) and [document](https://ai.google.dev/gemini-api/docs/interactions/document-processing) understanding capabilities.
- Learn about multimodal [file prompting strategies](https://ai.google.dev/gemini-api/docs/interactions/files#prompt-guide).


# Nano Banana image generation

Prompt to prototype fully-functional, UI-complete apps, and see Nano Banana 2 integrated with real-world tools, data, and the Gemini ecosystem. All before writing a single line of code.

- [Try a Nano Banana 2 app](https://aistudio.google.com/apps/bundled/pet_passport)
- Or build your own from prompts:
- ![magazine](https://storage.googleapis.com/generativeai-downloads/images/magazine-2.jpg) ![london](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/05-output.jpg) ![restore](https://storage.googleapis.com/generativeai-downloads/images/quetzal.png) ![banana](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/06-output.jpg) ![cafe](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/02-a-photo-of-an-everyday-scene-at-a-busy-cafe-servin.jpg) ![article](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/10-use-search-to-find-how-the-gemini-3-flash-launch-h.jpg) ![dog](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/01-an-icon-representing-a-cute-dog-the-background-is-.jpg) ![isometric](https://storage.googleapis.com/generativeai-downloads/images/isometric-pool.jpg)
- ![magazine](https://storage.googleapis.com/generativeai-downloads/images/magazine-2.jpg) Generated by Nano Banana 2 **Prompt:** "A photo of a glossy magazine cover, the minimal blue cover has the large bold words Nano Banana. The text is in a serif font and fills the view. No other text. In front of the text there is a portrait of a person in a sleek and minimal dress. She is playfully holding the number 2, which is the focal point.   
  Put the issue number and "Feb 2026" date in the corner along with a barcode. The magazine is on a shelf against an orange plastered wall, within a designer store." Create [professional product shots](https://ai.google.dev/gemini-api/docs/image-generation#4_product_mockups_commercial_photography) in [AI Studio](https://aistudio.google.com/apps?features=chat_based_image_editing)
- ![london](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/05-output.jpg) Generated by Nano Banana Pro **Prompt:** "Present a clear, 45° top-down isometric miniature 3D cartoon scene of London, featuring its most iconic landmarks and architectural elements. Use soft, refined textures with realistic PBR materials and gentle, lifelike lighting and shadows. Integrate the current weather conditions directly into the city environment to create an immersive atmospheric mood. Use a clean, minimalistic composition with a soft, solid-colored background. At the top-center, place the title "London" in large bold text, a prominent weather icon beneath it, then the date (small text) and temperature (medium text). All text must be centered with consistent spacing, and may subtly overlap the tops of the buildings." Learn more about [search grounding](https://ai.google.dev/gemini-api/docs/image-generation#use-with-grounding) and try it in [AI Studio](https://aistudio.google.com/apps?features=chat_based_image_editing,search_grounding)
- ![quetzal](https://storage.googleapis.com/generativeai-downloads/images/quetzal.png) Generated by Nano Banana 2 **Prompt:** "Use image search to find accurate images of a resplendent quetzal bird. Create a beautiful 3:2 wallpaper of this bird, with a natural top to bottom gradient and minimal composition." Use Google [Image Search](https://ai.google.dev/gemini-api/docs/image-generation#image-search) grounding with Nano Banana 2. Try it in [AI Studio](https://aistudio.google.com/apps?features=chat_based_image_editing,search_grounding)
- ![banana](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/06.jpg) Generated by Nano Banana Pro **Prompt:** "Put this logo on a high-end ad for a banana scented perfume. The logo is perfectly integrated into the bottle." Try Nano Banana's [high fidelity detail preservation](https://ai.google.dev/gemini-api/docs/image-generation#5_high-fidelity_detail_preservation) in [AI Studio](https://aistudio.google.com/apps?features=chat_based_image_editing)
- ![cafe](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/02-a-photo-of-an-everyday-scene-at-a-busy-cafe-servin.jpg) Generated by Nano Banana Pro **Prompt:** "A photo of an everyday scene at a busy cafe serving breakfast. In the foreground is an anime man with blue hair, one of the people is a pencil sketch, another is a claymation person" Experiment with different [artistic styles](https://ai.google.dev/gemini-api/docs/image-generation#3_style_transfer) with Nano Banana in [AI Studio](https://aistudio.google.com/apps?features=chat_based_image_editing)
- ![article](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/10-use-search-to-find-how-the-gemini-3-flash-launch-h.jpg) Generated by Nano Banana Pro **Prompt:** "Use search to find how the Gemini 3 Flash launch has been received. Use this information to write a short article about it (with headings). Return a photo of the article as it appeared in a design focused glossy magazine. It is a photo of a single folded over page, showing the article about Gemini 3 Flash. One hero photo. Headline in serif." Generate [accurate text](https://ai.google.dev/gemini-api/docs/image-generation#3_accurate_text_in_images) from [search](https://ai.google.dev/gemini-api/docs/image-generation#use-with-grounding). Try Nano Banana in [AI Studio](https://aistudio.google.com/apps?features=chat_based_image_editing,search_grounding)
- ![dog](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/01-an-icon-representing-a-cute-dog-the-background-is-.jpg) Generated by Nano Banana Pro **Prompt:** "An icon representing a cute dog. The background is white. Make the icons in a colorful and tactile 3D style. No text." Create [icons, stickers, and assets](https://ai.google.dev/gemini-api/docs/image-generation#2_stylized_illustrations_stickers) with Nano Banana in [AI Studio](https://aistudio.google.com/apps?features=chat_based_image_editing,search_grounding)
- ![isometric](https://storage.googleapis.com/generativeai-downloads/images/isometric-pool.jpg) Generated by Nano Banana 2 **Prompt:** "Make a photo that is perfectly isometric. It is not a miniature, it is a captured photo that just happened to be perfectly isometric. It is a photo of a beautiful modern garden. There's a large 2 shaped pool and the words: Nano Banana 2." Try [photorealistic image generation](https://ai.google.dev/gemini-api/docs/image-generation#1_photorealistic_scenes) in [AI Studio](https://aistudio.google.com/apps?features=chat_based_image_editing)

**Nano Banana** is the name for Gemini's native image generation capabilities.
Gemini can generate and process images conversationally
with text, images, or a combination of both. This lets you create, edit, and
iterate on visuals with unprecedented control.

Nano Banana refers to three distinct models available in the Gemini API:

- **Nano Banana 2** : The [Gemini 3.1 Flash Image Preview](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-image-preview) model (`gemini-3.1-flash-image-preview`). This model serves as the high-efficiency counterpart to Gemini 3 Pro Image, optimized for speed and high-volume developer use cases.
- **Nano Banana Pro** : The [Gemini 3 Pro Image Preview](https://ai.google.dev/gemini-api/docs/models/gemini-3-pro-image-preview) model (`gemini-3-pro-image-preview`). This model is designed for professional asset production, utilizing advanced reasoning ("Thinking") to follow complex instructions and render high-fidelity text.
- **Nano Banana** : The [Gemini 2.5 Flash Image](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image) model (`gemini-2.5-flash-image`). This model is designed for speed and efficiency, optimized for high-volume, low-latency tasks.

All generated images include a [SynthID watermark](https://ai.google.dev/responsible/docs/safeguards/synthid).

## Image generation (text-to-image)

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    client = genai.Client()

    prompt = ("Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme")
    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=[prompt],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("generated_image.png")

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt =
        "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("gemini-native-image.png", buffer);
          console.log("Image saved as gemini-native-image.png");
        }
      }
    }

    main();

### Go

    package main

    import (
      "context"
      "fmt"
      "log"
      "os"
      "google.golang.org/genai"
    )

    func main() {

      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      result, _ := client.Models.GenerateContent(
          ctx,
          "gemini-3.1-flash-image-preview",
          genai.Text("Create a picture of a nano banana dish in a " +
                     " fancy restaurant with a Gemini theme"),
      )

      for _, part := range result.Candidates[0].Content.Parts {
          if part.Text != "" {
              fmt.Println(part.Text)
          } else if part.InlineData != nil {
              imageBytes := part.InlineData.Data
              outputFilename := "gemini_generated_image.png"
              _ = os.WriteFile(outputFilename, imageBytes, 0644)
          }
      }
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    public class TextToImage {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-3.1-flash-image-preview",
              "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme",
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("_01_generated_image.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{
          "parts": [
            {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
          ]
        }]
      }'

## Image editing (text-and-image-to-image)

**Reminder** : Make sure you have the necessary rights to any images you upload.
Don't generate content that infringe on others' rights, including videos or
images that deceive, harass, or harm. Your use of this generative AI service is
subject to our [Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy).

Provide an image and use text prompts to add, remove, or modify elements,
change the style, or adjust the color grading.

The following example demonstrates uploading `base64` encoded images.
For multiple images, larger payloads, and supported MIME types, check the [Image
understanding](https://ai.google.dev/gemini-api/docs/image-understanding) page.

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    client = genai.Client()

    prompt = (
        "Create a picture of my cat eating a nano-banana in a "
        "fancy restaurant under the Gemini constellation",
    )

    image = Image.open("/path/to/cat_image.png")

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=[prompt, image],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("generated_image.png")

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const imagePath = "path/to/cat_image.png";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const prompt = [
        { text: "Create a picture of my cat eating a nano-banana in a" +
                "fancy restaurant under the Gemini constellation" },
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image,
          },
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("gemini-native-image.png", buffer);
          console.log("Image saved as gemini-native-image.png");
        }
      }
    }

    main();

### Go

    package main

    import (
     "context"
     "fmt"
     "log"
     "os"
     "google.golang.org/genai"
    )

    func main() {

     ctx := context.Background()
     client, err := genai.NewClient(ctx, nil)
     if err != nil {
         log.Fatal(err)
     }

     imagePath := "/path/to/cat_image.png"
     imgData, _ := os.ReadFile(imagePath)

     parts := []*genai.Part{
       genai.NewPartFromText("Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation"),
       &genai.Part{
         InlineData: &genai.Blob{
           MIMEType: "image/png",
           Data:     imgData,
         },
       },
     }

     contents := []*genai.Content{
       genai.NewContentFromParts(parts, genai.RoleUser),
     }

     result, _ := client.Models.GenerateContent(
         ctx,
         "gemini-3.1-flash-image-preview",
         contents,
     )

     for _, part := range result.Candidates[0].Content.Parts {
         if part.Text != "" {
             fmt.Println(part.Text)
         } else if part.InlineData != nil {
             imageBytes := part.InlineData.Data
             outputFilename := "gemini_generated_image.png"
             _ = os.WriteFile(outputFilename, imageBytes, 0644)
         }
     }
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class TextAndImageToImage {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-3.1-flash-image-preview",
              Content.fromParts(
                  Part.fromText("""
                      Create a picture of my cat eating a nano-banana in
                      a fancy restaurant under the Gemini constellation
                      """),
                  Part.fromBytes(
                      Files.readAllBytes(
                          Path.of("src/main/resources/cat.jpg")),
                      "image/jpeg")),
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("gemini_generated_image.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"contents\": [{
            \"parts\":[
                {\"text\": \"'Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation\"},
                {
                  \"inline_data\": {
                    \"mime_type\":\"image/jpeg\",
                    \"data\": \"<BASE64_IMAGE_DATA>\"
                  }
                }
            ]
          }]
        }"

### Multi-turn image editing

Keep generating and editing images conversationally. Chat or multi-turn
conversation is the recommended way to iterate on images. The following
example shows a prompt to generate an infographic about photosynthesis.

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    chat = client.chats.create(
        model="gemini-3.1-flash-image-preview",
        config=types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
            tools=[{"google_search": {}}]
        )
    )

    message = "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader."

    response = chat.send_message(message)

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif image:= part.as_image():
            image.save("photosynthesis.png")

### Javascript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const chat = ai.chats.create({
        model: "gemini-3.1-flash-image-preview",
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          tools: [{googleSearch: {}}],
        },
      });
    }

    await main();

    const message = "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader."

    let response = await chat.sendMessage({message});

    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("photosynthesis.png", buffer);
          console.log("Image saved as photosynthesis.png");
        }
    }

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"

        "google.golang.org/genai"
    )

    func main() {
        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }
        defer client.Close()

        model := client.GenerativeModel("gemini-3.1-flash-image-preview")
        model.GenerationConfig = &pb.GenerationConfig{
            ResponseModalities: []pb.ResponseModality{genai.Text, genai.Image},
        }
        chat := model.StartChat()

        message := "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader."

        resp, err := chat.SendMessage(ctx, genai.Text(message))
        if err != nil {
            log.Fatal(err)
        }

        for _, part := range resp.Candidates[0].Content.Parts {
            if txt, ok := part.(genai.Text); ok {
                fmt.Printf("%s", string(txt))
            } else if img, ok := part.(genai.ImageData); ok {
                err := os.WriteFile("photosynthesis.png", img.Data, 0644)
                if err != nil {
                    log.Fatal(err)
                }
            }
        }
    }

### Java

    import com.google.genai.Chat;
    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.GoogleSearch;
    import com.google.genai.types.ImageConfig;
    import com.google.genai.types.Part;
    import com.google.genai.types.RetrievalConfig;
    import com.google.genai.types.Tool;
    import com.google.genai.types.ToolConfig;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class MultiturnImageEditing {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {

          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .tools(Tool.builder()
                  .googleSearch(GoogleSearch.builder().build())
                  .build())
              .build();

          Chat chat = client.chats.create("gemini-3.1-flash-image-preview", config);

          GenerateContentResponse response = chat.sendMessage("""
              Create a vibrant infographic that explains photosynthesis
              as if it were a recipe for a plant's favorite food.
              Show the "ingredients" (sunlight, water, CO2)
              and the "finished dish" (sugar/energy).
              The style should be like a page from a colorful
              kids' cookbook, suitable for a 4th grader.
              """);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("photosynthesis.png"), blob.data().get());
              }
            }
          }
          // ...
        }
      }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{
          "role": "user",
          "parts": [
            {"text": "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plants favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids cookbook, suitable for a 4th grader."}
          ]
        }],
        "generationConfig": {
          "responseModalities": ["TEXT", "IMAGE"]
        }
      }'

![AI-generated infographic about photosynthesis](https://ai.google.dev/static/gemini-api/docs/images/infographic-eng.png) AI-generated infographic about photosynthesis

You can then use the same chat to change the language on the graphic to Spanish.

### Python

    message = "Update this infographic to be in Spanish. Do not change any other elements of the image."
    aspect_ratio = "16:9" # "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"
    resolution = "2K" # "512", "1K", "2K", "4K"

    response = chat.send_message(message,
        config=types.GenerateContentConfig(
            response_format={"image": {aspect_ratio: aspect_ratio,                 image_size: resolution}},
        ))

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif image:= part.as_image():
            image.save("photosynthesis_spanish.png")

### Javascript

    const message = 'Update this infographic to be in Spanish. Do not change any other elements of the image.';
    const aspectRatio = '16:9';
    const resolution = '2K';

    let response = await chat.sendMessage({
      message,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        responseFormat: {
        image: {
          aspectRatio: aspectRatio,
          imageSize: resolution,
        }
      },
        tools: [{googleSearch: {}}],
      },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("photosynthesis2.png", buffer);
          console.log("Image saved as photosynthesis2.png");
        }
    }

### Go

    message = "Update this infographic to be in Spanish. Do not change any other elements of the image."
    aspect_ratio = "16:9" // "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"
    resolution = "2K"     // "512", "1K", "2K", "4K"

    model.GenerationConfig.ImageConfig = &pb.ImageConfig{
        AspectRatio: aspect_ratio,
        ImageSize:   resolution,
    }

    resp, err = chat.SendMessage(ctx, genai.Text(message))
    if err != nil {
        log.Fatal(err)
    }

    for _, part := range resp.Candidates[0].Content.Parts {
        if txt, ok := part.(genai.Text); ok {
            fmt.Printf("%s", string(txt))
        } else if img, ok := part.(genai.ImageData); ok {
            err := os.WriteFile("photosynthesis_spanish.png", img.Data, 0644)
            if err != nil {
                log.Fatal(err)
            }
        }
    }

### Java

    String aspectRatio = "16:9"; // "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"
    String resolution = "2K"; // "512", "1K", "2K", "4K"

    config = GenerateContentConfig.builder()
        .responseModalities("TEXT", "IMAGE")
        .imageConfig(ImageConfig.builder()
            .aspectRatio(aspectRatio)
            .imageSize(resolution)
            .build())
        .build();

    response = chat.sendMessage(
        "Update this infographic to be in Spanish. " + 
        "Do not change any other elements of the image.",
        config);

    for (Part part : response.parts()) {
      if (part.text().isPresent()) {
        System.out.println(part.text().get());
      } else if (part.inlineData().isPresent()) {
        var blob = part.inlineData().get();
        if (blob.data().isPresent()) {
          Files.write(Paths.get("photosynthesis_spanish.png"), blob.data().get());
        }
      }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "contents": [
          {
            "role": "user",
            "parts": [{"text": "Create a vibrant infographic that explains photosynthesis..."}]
          },
          {
            "role": "model",
            "parts": [{"inline_data": {"mime_type": "image/png", "data": "<PREVIOUS_IMAGE_DATA>"}}]
          },
          {
            "role": "user",
            "parts": [{"text": "Update this infographic to be in Spanish. Do not change any other elements of the image."}]
          }
        ],
        "tools": [{"google_search": {}}],
        "generationConfig": {
          "responseModalities": ["TEXT", "IMAGE"],
          "responseFormat": {
        "image": {
            "aspectRatio": "16:9",
            "imageSize": "2K"
          }
      }
        }
      }'

![AI-generated infographic of photosynthesis in Spanish](https://ai.google.dev/static/gemini-api/docs/images/infographic-spanish.png) AI-generated infographic of photosynthesis in Spanish

## New with Gemini 3 Image models

Gemini 3 offers state-of-the-art image generation and editing models. Gemini 3.1
Flash Image is optimized for speed and high-volume use-cases, and Gemini 3
Pro Image is optimized for professional asset production.
Designed to tackle the most challenging workflows through advanced reasoning,
they excel at complex, multi-turn creation and modification tasks.

- **High-resolution output** : Built-in generation capabilities for 1K, 2K, and 4K visuals.
  - **Gemini 3.1 Flash Image** adds the smaller 512 (0.5K) resolution.
- **Advanced text rendering**: Capable of generating legible, stylized text for infographics, menus, diagrams, and marketing assets.
- **Grounding with Google Search** : The model can use Google Search as a tool to verify facts and generate imagery based on real-time data (e.g., current weather maps, stock charts, recent events).
  - **Gemini 3.1 Flash Image** adds the integration of Grounding with Google Search for Images alongside Web Search.
- **Thinking mode**: The model utilizes a "thinking" process to reason through complex prompts. It generates interim "thought images" (visible in the backend but not charged) to refine the composition before producing the final high-quality output.
- **Up to 14 reference images**: You can now mix up to 14 reference images to produce the final image.
- **New aspect ratios** : Gemini 3.1 Flash Image Preview adds 1:4, 4:1, 1:8, and 8:1 [aspect ratios](https://ai.google.dev/gemini-api/docs/image-generation#aspect_ratios_and_image_size).

### Use up to 14 reference images

Gemini 3 image models let you to mix up to 14 reference images. These 14 images
can include the following:

| Gemini 3.1 Flash Image Preview | Gemini 3 Pro Image Preview |
|---|---|
| Up to 10 images of objects with high-fidelity to include in the final image | Up to 6 images of objects with high-fidelity to include in the final image |
| Up to 4 images of characters to maintain character consistency | Up to 5 images of characters to maintain character consistency |

### Python

    from google import genai
    from google.genai import types
    from PIL import Image

    prompt = "An office group photo of these people, they are making funny faces."
    aspect_ratio = "5:4" # "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"
    resolution = "2K" # "512", "1K", "2K", "4K"

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=[
            prompt,
            Image.open('person1.png'),
            Image.open('person2.png'),
            Image.open('person3.png'),
            Image.open('person4.png'),
            Image.open('person5.png'),
        ],
        config=types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
            response_format={"image": {aspect_ratio: aspect_ratio,                 image_size: resolution}},
        )
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif image:= part.as_image():
            image.save("office.png")

### Javascript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt =
          'An office group photo of these people, they are making funny faces.';
      const aspectRatio = '5:4';
      const resolution = '2K';

    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile1,
        },
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile2,
        },
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile3,
        },
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile4,
        },
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile5,
        },
      }
    ];

    const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: contents,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          responseFormat: {
        image: {
            aspectRatio: aspectRatio,
            imageSize: resolution,
          }
      },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("image.png", buffer);
          console.log("Image saved as image.png");
        }
      }

    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"

        "google.golang.org/genai"
    )

    func main() {
        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }
        defer client.Close()

        model := client.GenerativeModel("gemini-3.1-flash-image-preview")
        model.GenerationConfig = &pb.GenerationConfig{
            ResponseModalities: []pb.ResponseModality{genai.Text, genai.Image},
            ImageConfig: &pb.ImageConfig{
                AspectRatio: "5:4",
                ImageSize:   "2K",
            },
        }

        img1, err := os.ReadFile("person1.png")
        if err != nil { log.Fatal(err) }
        img2, err := os.ReadFile("person2.png")
        if err != nil { log.Fatal(err) }
        img3, err := os.ReadFile("person3.png")
        if err != nil { log.Fatal(err) }
        img4, err := os.ReadFile("person4.png")
        if err != nil { log.Fatal(err) }
        img5, err := os.ReadFile("person5.png")
        if err != nil { log.Fatal(err) }

        parts := []genai.Part{
            genai.Text("An office group photo of these people, they are making funny faces."),
            genai.ImageData{MIMEType: "image/png", Data: img1},
            genai.ImageData{MIMEType: "image/png", Data: img2},
            genai.ImageData{MIMEType: "image/png", Data: img3},
            genai.ImageData{MIMEType: "image/png", Data: img4},
            genai.ImageData{MIMEType: "image/png", Data: img5},
        }

        resp, err := model.GenerateContent(ctx, parts...)
        if err != nil {
            log.Fatal(err)
        }

        for _, part := range resp.Candidates[0].Content.Parts {
            if txt, ok := part.(genai.Text); ok {
                fmt.Printf("%s", string(txt))
            } else if img, ok := part.(genai.ImageData); ok {
                err := os.WriteFile("office.png", img.Data, 0644)
                if err != nil {
                    log.Fatal(err)
                }
            }
        }
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.types.Content;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.ImageConfig;
    import com.google.genai.types.Part;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;

    public class GroupPhoto {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .imageConfig(ImageConfig.builder()
                  .aspectRatio("5:4")
                  .imageSize("2K")
                  .build())
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-3.1-flash-image-preview",
              Content.fromParts(
                  Part.fromText("An office group photo of these people, they are making funny faces."),
                  Part.fromBytes(Files.readAllBytes(Path.of("person1.png")), "image/png"),
                  Part.fromBytes(Files.readAllBytes(Path.of("person2.png")), "image/png"),
                  Part.fromBytes(Files.readAllBytes(Path.of("person3.png")), "image/png"),
                  Part.fromBytes(Files.readAllBytes(Path.of("person4.png")), "image/png"),
                  Part.fromBytes(Files.readAllBytes(Path.of("person5.png")), "image/png")
              ), config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("office.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"contents\": [{
            \"parts\":[
                {\"text\": \"An office group photo of these people, they are making funny faces.\"},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_DATA_IMG_1>\"}},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_DATA_IMG_2>\"}},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_DATA_IMG_3>\"}},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_DATA_IMG_4>\"}},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_DATA_IMG_5>\"}}
            ]
          }],
          \"generationConfig\": {
            \"responseModalities\": [\"TEXT\", \"IMAGE\"],
            \"responseFormat\": {
            \"image\": {
              \"aspectRatio\": \"5:4\",
              \"imageSize\": \"2K\"
            }
          }
          }
        }"

![AI-generated office group photo](https://ai.google.dev/static/gemini-api/docs/images/office-group-photo.jpeg) AI-generated office group photo

### Grounding with Google Search

Use the [Google Search tool](https://ai.google.dev/gemini-api/docs/google-search) to generate images
based on real-time information, such as weather forecasts, stock charts, or
recent events.

Note that when using Grounding with Google Search with image generation,
image-based search results are not passed to the generation model and are
excluded from the response (see [Grounding with Google Search for images](https://ai.google.dev/gemini-api/docs/image-generation#image-search))

### Python

    from google import genai
    prompt = "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day"
    aspect_ratio = "16:9" # "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=['Text', 'Image'],
            response_format={"image": {aspect_ratio: aspect_ratio,}},
            tools=[{"google_search": {}}]
        )
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif image:= part.as_image():
            image.save("weather.png")

### Javascript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt = 'Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day';
      const aspectRatio = '16:9';
      const resolution = '2K';

    const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          responseFormat: {
        image: {
            aspectRatio: aspectRatio,
            imageSize: resolution,
          }
      },
        tools: [{ googleSearch: {} }]
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("image.png", buffer);
          console.log("Image saved as image.png");
        }
      }

    }

    main();

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.GoogleSearch;
    import com.google.genai.types.ImageConfig;
    import com.google.genai.types.Part;
    import com.google.genai.types.Tool;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    public class SearchGrounding {
      public static void main(String[] args) throws IOException {

        try (Client client = new Client()) {
          GenerateContentConfig config = GenerateContentConfig.builder()
              .responseModalities("TEXT", "IMAGE")
              .imageConfig(ImageConfig.builder()
                  .aspectRatio("16:9")
                  .build())
              .tools(Tool.builder()
                  .googleSearch(GoogleSearch.builder().build())
                  .build())
              .build();

          GenerateContentResponse response = client.models.generateContent(
              "gemini-3.1-flash-image-preview", """
                  Visualize the current weather forecast for the next 5 days
                  in San Francisco as a clean, modern weather chart.
                  Add a visual on what I should wear each day
                  """,
              config);

          for (Part part : response.parts()) {
            if (part.text().isPresent()) {
              System.out.println(part.text().get());
            } else if (part.inlineData().isPresent()) {
              var blob = part.inlineData().get();
              if (blob.data().isPresent()) {
                Files.write(Paths.get("weather.png"), blob.data().get());
              }
            }
          }
        }
      }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{"parts": [{"text": "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day"}]}],
        "tools": [{"google_search": {}}],
        "generationConfig": {
          "responseModalities": ["TEXT", "IMAGE"],
          "responseFormat": {
        "image": {"aspectRatio": "16:9"}
      }
        }
      }'

![AI-generated five day weather chart for San Francisco](https://ai.google.dev/static/gemini-api/docs/images/weather-forecast.png) AI-generated five day weather chart for San Francisco

The response includes `groundingMetadata` which contains the following required
fields:

- **`searchEntryPoint`**: Contains the HTML and CSS to render the required search suggestions.
- **`groundingChunks`**: Returns the top 3 web sources used to ground the generated image

### Grounding with Google Search for Images (3.1 Flash)

> [!NOTE]
> **Note:** This feature is only available for the Gemini 3.1 Flash Image model.

Grounding with Google Search for images allows models to use web images retrieved via
Google Search as visual context for image generation. Image Search is a
new search type within the existing Grounding with Google Search tool,
functioning alongside standard [Web Search](https://ai.google.dev/gemini-api/docs/image-generation#use-with-grounding).

To enable Image Search, configure the `googleSearch` tool in your API request
and specify `imageSearch` within the `searchTypes` object. Image Search can be
used independently or together with Web Search.

Note that Grounding with Google Search for images can't be used to search for people.

### Python

    from google import genai
    prompt = "A detailed painting of a Timareta butterfly resting on a flower"

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
            tools=[
                types.Tool(google_search=types.GoogleSearch(
                    search_types=types.SearchTypes(
                        web_search=types.WebSearch(),
                        image_search=types.ImageSearch()
                    )
                ))
            ]
        )
    )

    # Display grounding sources if available
    if response.candidates and response.candidates[0].grounding_metadata and response.candidates[0].grounding_metadata.search_entry_point:
        display(HTML(response.candidates[0].grounding_metadata.search_entry_point.rendered_content))

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt = "A detailed painting of a Timareta butterfly resting on a flower";

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: prompt,
        config: {
          responseModalities: ["IMAGE"],
          tools: [
            {
              googleSearch: {
                searchTypes: {
                  webSearch: {},
                  imageSearch: {}
                }
              }
            }
          ]
        }
      });

      // Display grounding sources if available
      if (response.candidates && response.candidates[0].groundingMetadata && response.candidates[0].groundingMetadata.searchEntryPoint) {
          console.log(response.candidates[0].groundingMetadata.searchEntryPoint.renderedContent);
      }
    }

    main();

### Go

    package main

    import (
      "context"
      "fmt"
      "log"

      "google.golang.org/genai"
      pb "google.golang.org/genai/schema"
    )

    func main() {
      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
        log.Fatal(err)
      }
      defer client.Close()

      model := client.GenerativeModel("gemini-3.1-flash-image-preview")
      model.Tools = []*pb.Tool{
        {
          GoogleSearch: &pb.GoogleSearch{
            SearchTypes: &pb.SearchTypes{
              WebSearch:   &pb.WebSearch{},
              ImageSearch: &pb.ImageSearch{},
            },
          },
        },
      }
      model.GenerationConfig = &pb.GenerationConfig{
        ResponseModalities: []pb.ResponseModality{genai.Image},
      }

      prompt := "A detailed painting of a Timareta butterfly resting on a flower"
      resp, err := model.GenerateContent(ctx, genai.Text(prompt))
      if err != nil {
        log.Fatal(err)
      }

      if resp.Candidates[0].GroundingMetadata != nil && resp.Candidates[0].GroundingMetadata.SearchEntryPoint != nil {
        fmt.Println(resp.Candidates[0].GroundingMetadata.SearchEntryPoint.RenderedContent)
      }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{"parts": [{"text": "A detailed painting of a Timareta butterfly resting on a flower"}]}],
        "tools": [{"google_search": {"searchTypes": {"webSearch": {}, "imageSearch": {}}}}],
        "generationConfig": {
          "responseModalities": ["IMAGE"]
        }
      }'

**Display requirements**

When you use Image Search within Grounding with Google Search, you must comply
with the following conditions:

- **Source attribution**: You must provide a link to the webpage containing the source image (the "containing page," not the image file itself) in a manner that the user will recognize as a link.
- **Direct navigation**: If you also choose to display the source images, you must provide a direct, single-click path from the source images to its containing source webpage. Any other implementation that delays or abstracts the end user's access to the source webpage, including but not limited to any multi-click path or the use of an intermediate image viewer, is not permitted.

**Response**

For grounded responses using image search, the API provides clear attribution
and metadata to link its output to verified sources. Key fields in the
`groundingMetadata` object include:

- **`imageSearchQueries`**: The specific queries used by the model for visual context (image search).
- **`groundingChunks`**: Contains source information for retrieved results.
  For image sources, these will be returned as redirect URLs using a new image
  chunk type. This chunk includes:

  - **`uri`**: The web page URL for attribution (the landing page).
  - **`image_uri`**: The direct image URL.
- **`groundingSupports`**: Provides specific mappings that link the generated
  content to its relevant citation source in the chunks.

- **`searchEntryPoint`**: Includes the "Google Search" chip containing
  compliant HTML and CSS to render Search Suggestions.

### Generate images up to 4K resolution

Gemini 3 image models generate 1K images by default but can also output 2K,
4K, and 512 (0.5K) (Gemini 3.1 Flash Image only) images. To generate higher
resolution assets, specify the `image_size` in the `generation_config`.

You must use an uppercase 'K' (e.g. 1K, 2K, 4K). The `512` value does not use a 'K' suffix. Lowercase
parameters (e.g., 1k) will be rejected.

### Python

    from google import genai
    from google.genai import types

    prompt = "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English."
    aspect_ratio = "1:1" # "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"
    resolution = "1K" # "512", "1K", "2K", "4K"

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
            response_format={"image": {aspect_ratio: aspect_ratio,                 image_size: resolution}},
        )
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif image:= part.as_image():
            image.save("butterfly.png")

### Javascript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt =
          'Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English.';
      const aspectRatio = '1:1';
      const resolution = '1K';

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          responseFormat: {
        image: {
            aspectRatio: aspectRatio,
            imageSize: resolution,
          }
      },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("image.png", buffer);
          console.log("Image saved as image.png");
        }
      }

    }

    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"

        "google.golang.org/genai"
    )

    func main() {
        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }
        defer client.Close()

        model := client.GenerativeModel("gemini-3.1-flash-image-preview")
        model.GenerationConfig = &pb.GenerationConfig{
            ResponseModalities: []pb.ResponseModality{genai.Text, genai.Image},
            ImageConfig: &pb.ImageConfig{
                AspectRatio: "1:1",
                ImageSize:   "1K",
            },
        }

        prompt := "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English."
        resp, err := model.GenerateContent(ctx, genai.Text(prompt))
        if err != nil {
            log.Fatal(err)
        }

        for _, part := range resp.Candidates[0].Content.Parts {
            if txt, ok := part.(genai.Text); ok {
                fmt.Printf("%s", string(txt))
            } else if img, ok := part.(genai.ImageData); ok {
                err := os.WriteFile("butterfly.png", img.Data, 0644)
                if err != nil {
                    log.Fatal(err)
                }
            }
        }
    }

### Java

    import com.google.genai.Client;
    import com.google.genai.types.GenerateContentConfig;
    import com.google.genai.types.GenerateContentResponse;
    import com.google.genai.types.GoogleSearch;
    import com.google.genai.types.ImageConfig;
    import com.google.genai.types.Part;
    import com.google.genai.types.Tool;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    public class HiRes {
        public static void main(String[] args) throws IOException {

          try (Client client = new Client()) {
            GenerateContentConfig config = GenerateContentConfig.builder()
                .responseModalities("TEXT", "IMAGE")
                .imageConfig(ImageConfig.builder()
                    .aspectRatio("16:9")
                    .imageSize("4K")
                    .build())
                .build();

            GenerateContentResponse response = client.models.generateContent(
                "gemini-3.1-flash-image-preview", """
                  Da Vinci style anatomical sketch of a dissected Monarch butterfly.
                  Detailed drawings of the head, wings, and legs on textured
                  parchment with notes in English.
                  """,
                config);

            for (Part part : response.parts()) {
              if (part.text().isPresent()) {
                System.out.println(part.text().get());
              } else if (part.inlineData().isPresent()) {
                var blob = part.inlineData().get();
                if (blob.data().isPresent()) {
                  Files.write(Paths.get("butterfly.png"), blob.data().get());
                }
              }
            }
          }
        }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{"parts": [{"text": "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English."}]}],
        "tools": [{"google_search": {}}],
        "generationConfig": {
          "responseModalities": ["TEXT", "IMAGE"],
          "responseFormat": {
        "image": {"aspectRatio": "1:1", "imageSize": "1K"}
      }
        }
      }'

The following is an example image generated from this prompt:
![AI-generated Da Vinci style anatomical sketch of a dissected Monarch butterfly.](https://ai.google.dev/static/gemini-api/docs/images/gemini3-4k-image.png) AI-generated Da Vinci style anatomical sketch of a dissected Monarch butterfly.

### Thinking Process

Gemini 3 image models are thinking models that use a reasoning
process ("Thinking") for complex prompts. This feature is enabled by default and
cannot be disabled in the API. To learn more about the thinking process, see
the [Gemini Thinking](https://ai.google.dev/gemini-api/docs/thinking) guide.

The model generates up to two interim images to test composition and logic. The
last image within Thinking is also the final rendered image.

You can check the thoughts that lead to the final image being produced.

### Python

    for part in response.parts:
        if part.thought:
            if part.text:
                print(part.text)
            elif image:= part.as_image():
                image.show()

### Javascript

    for (const part of response.candidates[0].content.parts) {
      if (part.thought) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync('image.png', buffer);
          console.log('Image saved as image.png');
        }
      }
    }

#### Controlling thinking levels

With Gemini 3.1 Flash Image, you can control the amount of thinking the model
uses to balance quality and latency. The default `thinkingLevel` is `minimal`,
and the supported levels are `minimal` and `high`. Setting the
`thinkingLevel` to `minimal` provides the lowest latency responses. Note that
minimal thinking does not mean the model uses no thinking at all.

You can add the `includeThoughts` boolean to determine whether the model's
generated thoughts are returned in the response, or remain hidden.

### Python

    from google import genai

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents="A futuristic city built inside a giant glass bottle floating in space",
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
            thinking_config=types.ThinkingConfig(
                thinking_level="High",
                include_thoughts=True
            ),
        )
    )

    for part in response.parts:
        if part.thought: # Skip outputting thoughts
          continue
        if part.text:
          display(Markdown(part.text))
        elif image:= part.as_image():
          image.show()

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: "A futuristic city built inside a giant glass bottle floating in space",
        config: {
          responseModalities: ["IMAGE"],
          thinkingConfig: {
            thinkingLevel: "High",
            includeThoughts: true
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.thought) { // Skip outputting thoughts
          continue;
        }
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("image.png", buffer);
          console.log("Image saved as image.png");
        }
      }
    }
    main();

### Go

    package main

    import (
        "context"
        "fmt"
        "log"
        "os"

        "google.golang.org/genai"
        pb "google.golang.org/genai/schema"
    )

    func main() {
        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }
        defer client.Close()

        model := client.GenerativeModel("gemini-3.1-flash-image-preview")
        model.GenerationConfig = &pb.GenerationConfig{
            ResponseModalities: []pb.ResponseModality{genai.Image},
            ThinkingConfig: &pb.ThinkingConfig{
                ThinkingLevel:   "High",
                IncludeThoughts: true,
            },
        }

        prompt := "A futuristic city built inside a giant glass bottle floating in space"
        resp, err := model.GenerateContent(ctx, genai.Text(prompt))
        if err != nil {
            log.Fatal(err)
        }

        for _, part := range resp.Candidates[0].Content.Parts {
            if part.Thought { // Skip outputting thoughts
                continue
            }
            if txt, ok := part.(genai.Text); ok {
                fmt.Printf("%s", string(txt))
            } else if img, ok := part.(genai.ImageData); ok {
                err := os.WriteFile("image.png", img.Data, 0644)
                if err != nil {
                    log.Fatal(err)
                }
            }
        }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{"parts": [{"text": "A futuristic city built inside a giant glass bottle floating in space"}]}],
        "generationConfig": {
          "responseModalities": ["IMAGE"],
          "thinkingConfig": {
            "thinkingLevel": "High",
            "includeThoughts": true
          }
        }
      }'

Note that thinking tokens are billed regardless of whether `includeThoughts` is
set to `true` or `false`, as the [thinking process](https://ai.google.dev/gemini-api/docs/image-generation#thinking-process) always
happens by default whether you view the process or not.

#### Thought Signatures

Thought signatures are encrypted representations of the
model's internal thought process and are used to preserve reasoning context
across multi-turn interactions. All responses include a `thought_signature`
field. As a general rule, if you receive a thought signature in a model
response, you should pass it back exactly as received when sending the
conversation history in the next turn. Failure to circulate thought signatures
may cause the response to fail. Check the [thought signature](https://ai.google.dev/gemini-api/docs/thought-signatures)
documentation for more explanations of signatures overall.

> [!NOTE]
> **Note:** If you use the official [Google Gen AI SDKs](https://ai.google.dev/gemini-api/docs/libraries) and use the chat feature (or append the full model response object directly to history), **thought signatures are handled automatically**. You do not need to manually extract or manage them, or change your code.

Here is how thought signatures work:

- All `inline_data` parts with image `mimetype` which are part of the response should have signature.
- If there are some text parts at the beginning (before any image) right after the thoughts, the first text part should also have a signature.
- If `inline_data` parts with image `mimetype` are part of thoughts, they won't have signatures.

The following code shows an example of where thought signatures are included:

    [
      {
        "inline_data": {
          "data": "<base64_image_data_0>",
          "mime_type": "image/png"
        },
        "thought": true // Thoughts don't have signatures
      },
      {
        "inline_data": {
          "data": "<base64_image_data_1>",
          "mime_type": "image/png"
        },
        "thought": true // Thoughts don't have signatures
      },
      {
        "inline_data": {
          "data": "<base64_image_data_2>",
          "mime_type": "image/png"
        },
        "thought": true // Thoughts don't have signatures
      },
      {
        "text": "Here is a step-by-step guide to baking macarons, presented in three separate images.\n\n### Step 1: Piping the Batter\n\nThe first step after making your macaron batter is to pipe it onto a baking sheet. This requires a steady hand to create uniform circles.\n\n",
        "thought_signature": "<Signature_A>" // The first non-thought part always has a signature
      },
      {
        "inline_data": {
          "data": "<base64_image_data_3>",
          "mime_type": "image/png"
        },
        "thought_signature": "<Signature_B>" // All image parts have a signatures
      },
      {
        "text": "\n\n### Step 2: Baking and Developing Feet\n\nOnce piped, the macarons are baked in the oven. A key sign of a successful bake is the development of \"feet\"---the ruffled edge at the base of each macaron shell.\n\n"
        // Follow-up text parts don't have signatures
      },
      {
        "inline_data": {
          "data": "<base64_image_data_4>",
          "mime_type": "image/png"
        },
        "thought_signature": "<Signature_C>" // All image parts have a signatures
      },
      {
        "text": "\n\n### Step 3: Assembling the Macaron\n\nThe final step is to pair the cooled macaron shells by size and sandwich them together with your desired filling, creating the classic macaron dessert.\n\n"
      },
      {
        "inline_data": {
          "data": "<base64_image_data_5>",
          "mime_type": "image/png"
        },
        "thought_signature": "<Signature_D>" // All image parts have a signatures
      }
    ]

## Other image generation modes

Gemini supports other image interaction modes based on prompt structure and
context, including:

- **Text to image(s) and text (interleaved):** Outputs images with related text.
  - Example prompt: "Generate an illustrated recipe for a paella."
- **Image(s) and text to image(s) and text (interleaved)** : Uses input images and text to create new related images and text.
  - Example prompt: (With an image of a furnished room) "What other color sofas would work in my space? can you update the image?"

## Generate images in batch

If you need to generate a lot of images, you can use the
[Batch API](https://ai.google.dev/gemini-api/docs/batch-api). You get higher
[rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) in exchange for a turnaround of up
to 24 hours.

Check the [Batch API image generation documentation](https://ai.google.dev/gemini-api/docs/batch-api#image-generation) and the [cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Batch_mode.ipynb)
for Batch API image examples and code.

## Prompting guide and strategies

Mastering image generation starts with one fundamental principle:
> **Describe the scene, don't just list keywords.**
> The model's core strength is its deep language understanding. A narrative,
> descriptive paragraph will almost always produce a better, more coherent image
> than a list of disconnected words.

### Prompts for generating images

The following strategies will help you create effective prompts to
generate exactly the images you're looking for.

#### Photography

For realistic images, use photography terms. Mention camera angles, lens types,
lighting, and fine details to guide the model toward a realistic result.

| **Prompt** | **Generated output** |
|---|---|
| A photo of a close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop. The scene is illuminated by soft, golden hour light streaming through a window, highlighting the fine texture of the clay. Captured with an 85mm portrait lens, resulting in a soft, blurred background (bokeh). The overall mood is serene and masterful. Vertical portrait orientation. | ![Elderly Japanese ceramicist](https://ai.google.dev/static/gemini-api/docs/images/photorealistic_example.png) |

#### Stylized illustrations and stickers

To create stickers, icons, or assets, be explicit about the style and request a
white background.

> [!NOTE]
> **Note:** The model does not support generating a transparent background.

| **Prompt** | **Generated output** |
|---|---|
| A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white. | ![Kawaii red panda sticker](https://ai.google.dev/static/gemini-api/docs/images/red_panda_sticker.png) |

#### Accurate text in images

Gemini excels at rendering text. Be clear about the text, the font style
(descriptively), and the overall design. Use Gemini 3 Pro Image Preview for
professional asset production.

| **Prompt** | **Generated output** |
|---|---|
| Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way. | ![Coffee shop logo](https://ai.google.dev/static/gemini-api/docs/images/logo_example.jpg) |

#### Product mockups and commercial photography

Perfect for creating clean, professional product shots for ecommerce,
advertising, or branding.

| **Prompt** | **Generated output** |
|---|---|
| A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image. | ![Ceramic coffee mug product shot](https://ai.google.dev/static/gemini-api/docs/images/product_mockup.png) |

#### Minimalist and negative space design

Excellent for creating backgrounds for websites, presentations, or marketing
materials where text will be overlaid.

| **Prompt** | **Generated output** |
|---|---|
| A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image. | ![Minimalist design with red maple leaf](https://ai.google.dev/static/gemini-api/docs/images/minimalist_design.png) |

#### Sequential art (Comic panel / Storyboard)

Builds on character consistency and scene description to create panels for
visual storytelling. For accuracy with text and storytelling ability, these
prompts work best with Gemini 3 Pro and Gemini 3.1 Flash Image Preview.

| **Prompt** | **Generated output** |
|---|---|
| **Input image:** ![Man in white glasses](https://ai.google.dev/static/gemini-api/docs/images/man_in_white_glasses.jpg) Input image **Prompt:** Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene. | ![Gritty noir comic panel](https://ai.google.dev/static/gemini-api/docs/images/comic_panel.jpg) |

#### Grounding with Google Search

Use Google Search to generate images based on recent or real-time information.
This is useful for news, weather, and other time-sensitive topics.

| **Prompt** | **Generated output** |
|---|---|
| Make a simple but stylish graphic of last night's Arsenal game in the Champion's League | ![Arsenal football score graphic](https://ai.google.dev/static/gemini-api/docs/images/football-score.jpg) |

### Prompts for editing images

These examples show how to provide images alongside your text prompts for
editing, composition, and style transfer.

#### Adding and removing elements

Provide an image and describe your change. The model will match the original
image's style, lighting, and perspective.

| **Prompt** | **Generated output** |
|---|---|
| **Input image:** :cat: Input image **Prompt:** Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and matches the soft lighting of the photo. | ![Cat with wizard hat](https://ai.google.dev/static/gemini-api/docs/images/cat_with_hat.png) |

#### Inpainting (Semantic masking)

Conversationally define a "mask" to edit a specific part of an image while
leaving the rest untouched.

| **Prompt** | **Generated output** |
|---|---|
| **Input image:** ![A wide shot of a modern, well-lit living room...](https://ai.google.dev/static/gemini-api/docs/images/living_room.png) Input image **Prompt:** Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged. | ![Living room with brown leather sofa](https://ai.google.dev/static/gemini-api/docs/images/living_room_edited.png) |

#### Style transfer

Provide an image and ask the model to recreate its content in a different
artistic style.

| **Prompt** | **Generated output** |
|---|---|
| **Input image:** ![A photorealistic, high-resolution photograph of a busy city street...](https://ai.google.dev/static/gemini-api/docs/images/city.png) Input image **Prompt:** Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows. | ![City street in Starry Night style](https://ai.google.dev/static/gemini-api/docs/images/city_style_transfer.png) |

#### Advanced composition: Combining multiple images

Provide multiple images as context to create a new, composite scene. This is
perfect for product mockups or creative collages.

| **Prompt** | **Generated output** |
|---|---|
| **Input images:** :dress: Input 1: Dress ![Full-body shot of a woman with her hair in a bun...](https://ai.google.dev/static/gemini-api/docs/images/model.png) Input 2: Model **Prompt:** Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment. | ![Fashion e-commerce shot](https://ai.google.dev/static/gemini-api/docs/images/fashion_ecommerce_shot.png) |

#### High-fidelity detail preservation

To ensure critical details (like a face or logo) are preserved during an edit,
describe them in great detail along with your edit request.

| **Prompt** | **Generated output** |
|---|---|
| **Input images:** :woman: Input 1: Woman ![A simple, modern logo with the letters 'G' and 'A'...](https://ai.google.dev/static/gemini-api/docs/images/logo.png) Input 2: Logo **Prompt:** Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt. | ![Woman with logo on t-shirt](https://ai.google.dev/static/gemini-api/docs/images/woman_with_logo.png) |

#### Bring something to life

Upload a rough sketch or drawing and ask the model to refine it into a finished image.

| **Prompt** | **Generated output** |
|---|---|
| **Input image:** ![Sketch of a car](https://ai.google.dev/static/gemini-api/docs/images/car-sketch.jpg) Rough sketch of a car **Prompt:** Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting. | ![Polished photo of concept car](https://ai.google.dev/static/gemini-api/docs/images/car-photo.jpg) |

#### Character consistency: 360 view

You can generate 360-degree views of a character by iteratively prompting for
different angles. For best results, include previously generated images in
subsequent prompts to maintain consistency. For complex poses, include a
reference image of the desired pose.

| **Prompt** | **Generated output** |
|---|---|
| **Input image:** ![Original input of a man in white glasses](https://ai.google.dev/static/gemini-api/docs/images/man_in_white_glasses.jpg) Original image **Prompt:** A studio portrait of this man against white, in profile looking right | ![Output of a man in white glasses looking right](https://ai.google.dev/static/gemini-api/docs/images/man_in_white_glasses_looking_right.jpg) Man in white glasses looking right ![Output of a man in white glasses looking forward](https://ai.google.dev/static/gemini-api/docs/images/man_in_white_glasses_looking_forward.jpg) Man in white glasses looking forward |

### Best Practices

To elevate your results from good to great, incorporate these professional
strategies into your workflow.

- **Be Hyper-Specific:** The more detail you provide, the more control you have. Instead of "fantasy armor," describe it: "ornate elven plate armor, etched with silver leaf patterns, with a high collar and pauldrons shaped like falcon wings."
- **Provide Context and Intent:** Explain the *purpose* of the image. The model's understanding of context will influence the final output. For example, "Create a logo for a high-end, minimalist skincare brand" will yield better results than just "Create a logo."
- **Iterate and Refine:** Don't expect a perfect image on the first try. Use the conversational nature of the model to make small changes. Follow up with prompts like, "That's great, but can you make the lighting a bit warmer?" or "Keep everything the same, but change the character's expression to be more serious."
- **Use Step-by-Step Instructions:** For complex scenes with many elements, break your prompt into steps. "First, create a background of a serene, misty forest at dawn. Then, in the foreground, add a moss-covered ancient stone altar. Finally, place a single, glowing sword on top of the altar."
- **Use "Semantic Negative Prompts":** Instead of saying "no cars," describe the desired scene positively: "an empty, deserted street with no signs of traffic."
- **Control the Camera:** Use photographic and cinematic language to control the composition. Terms like `wide-angle shot`, `macro shot`, `low-angle
  perspective`.

## Limitations

- For best performance, use the following languages: EN, ar-EG, de-DE, es-MX, fr-FR, hi-IN, id-ID, it-IT, ja-JP, ko-KR, pt-BR, ru-RU, ua-UA, vi-VN, zh-CN.
- Image generation does not support audio or video inputs.
- The model won't always follow the exact number of image outputs that the user explicitly asks for.
- `gemini-2.5-flash-image` works best with up to 3 images as input, while `gemini-3-pro-image-preview` supports 5 images with high fidelity, and up to 14 images in total. `gemini-3.1-flash-image-preview` supports character resemblance of up to 4 characters and the fidelity of up to 10 objects in a single workflow.
- When generating text for an image, Gemini works best if you first generate the text and then ask for an image with the text.
- `gemini-3.1-flash-image-preview` Grounding with Google Search does not support using real-world images of people from web search at this time.
- All generated images include a [SynthID watermark](https://ai.google.dev/responsible/docs/safeguards/synthid).

## Optional configurations

You can optionally configure the response modalities and aspect ratio of the
model's output in the `config` field of `generate_content` calls.

### Output types

The model defaults to returning text and image responses
(i.e. `response_modalities=['Text', 'Image']`).
You can configure the response to return only images without text using
`response_modalities=['Image']`.

### Python

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=[prompt],
        config=types.GenerateContentConfig(
            response_modalities=['Image']
        )
    )

### JavaScript

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: prompt,
        config: {
            responseModalities: ['Image']
        }
      });

### Go

    result, _ := client.Models.GenerateContent(
        ctx,
        "gemini-3.1-flash-image-preview",
        genai.Text("Create a picture of a nano banana dish in a " +
                    " fancy restaurant with a Gemini theme"),
        &genai.GenerateContentConfig{
            ResponseModalities: "Image",
        },
      )

### Java

    response = client.models.generateContent(
        "gemini-3.1-flash-image-preview",
        prompt,
        GenerateContentConfig.builder()
            .responseModalities("IMAGE")
            .build());

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "contents": [{
          "parts": [
            {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
          ]
        }],
        "generationConfig": {
          "responseModalities": ["Image"]
        }
      }'

### Aspect ratios and image size

The model defaults to matching the output image size to that of your input
image, or otherwise generates 1:1 squares.
You can control the aspect ratio of the output image using the `aspect_ratio`
field under `response_format` in the response request, shown here:

### Python

    # For gemini-2.5-flash-image
    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[prompt],
        config=types.GenerateContentConfig(
            response_format={"image": {aspect_ratio: "16:9",}}
        )
    )

    # For gemini-3.1-flash-image-preview and gemini-3-pro-image-preview
    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=[prompt],
        config=types.GenerateContentConfig(
            response_format={"image": {aspect_ratio: "16:9",                 image_size: "2K",}}
        )
    )

### JavaScript

    // For gemini-2.5-flash-image
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
        config: {
          responseFormat: {
        image: {
            aspectRatio: "16:9",
          }
      },
        }
      });

    // For gemini-3.1-flash-image-preview and gemini-3-pro-image-preview
    const response_gemini3 = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: prompt,
        config: {
          responseFormat: {
        image: {
            aspectRatio: "16:9",
            imageSize: "2K",
          }
      },
        }
      });

### Go

    // For gemini-2.5-flash-image
    result, _ := client.Models.GenerateContent(
        ctx,
        "gemini-2.5-flash-image",
        genai.Text("Create a picture of a nano banana dish in a " +
                    " fancy restaurant with a Gemini theme"),
        &genai.GenerateContentConfig{
            ImageConfig: &genai.ImageConfig{
              AspectRatio: "16:9",
            },
        }
      )

    // For gemini-3.1-flash-image-preview and gemini-3-pro-image-preview
    result_gemini3, _ := client.Models.GenerateContent(
        ctx,
        "gemini-3.1-flash-image-preview",
        genai.Text("Create a picture of a nano banana dish in a " +
                    " fancy restaurant with a Gemini theme"),
        &genai.GenerateContentConfig{
            ImageConfig: &genai.ImageConfig{
              AspectRatio: "16:9",
              ImageSize: "2K",
            },
        }
      )

### Java

    // For gemini-2.5-flash-image
    response = client.models.generateContent(
        "gemini-2.5-flash-image",
        prompt,
        GenerateContentConfig.builder()
            .imageConfig(ImageConfig.builder()
                .aspectRatio("16:9")
                .build())
            .build());

    // For gemini-3.1-flash-image-preview and gemini-3-pro-image-preview
    response_gemini3 = client.models.generateContent(
        "gemini-3.1-flash-image-preview",
        prompt,
        GenerateContentConfig.builder()
            .imageConfig(ImageConfig.builder()
                .aspectRatio("16:9")
                .imageSize("2K")
                .build())
            .build());

### REST

    # For gemini-2.5-flash-image
    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "contents": [{
          "parts": [
            {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
          ]
        }],
        "generationConfig": {
          "responseFormat": {
        "image": {
            "aspectRatio": "16:9"
          }
      }
        }
      }'

    # For gemini-3-pro-image-preview
    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "contents": [{
          "parts": [
            {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
          ]
        }],
        "generationConfig": {
          "responseFormat": {
        "image": {
            "aspectRatio": "16:9",
            "imageSize": "2K"
          }
      }
        }
      }'

The different ratios available and the size of the image generated are listed in
the following tables:

### 3.1 Flash Image Preview

| Aspect ratio | 512 resolution | 0.5K tokens | 1K resolution | 1K tokens | 2K resolution | 2K tokens | 4K resolution | 4K tokens |
|---|---|---|---|---|---|---|---|---|
| **1:1** | 512x512 | 747 | 1024x1024 | 1120 | 2048x2048 | 1680 | 4096x4096 | 2520 |
| **1:4** | 256x1024 | 747 | 512x2048 | 1120 | 1024x4096 | 1680 | 2048x8192 | 2520 |
| **1:8** | 192x1536 | 747 | 384x3072 | 1120 | 768x6144 | 1680 | 1536x12288 | 2520 |
| **2:3** | 424x632 | 747 | 848x1264 | 1120 | 1696x2528 | 1680 | 3392x5056 | 2520 |
| **3:2** | 632x424 | 747 | 1264x848 | 1120 | 2528x1696 | 1680 | 5056x3392 | 2520 |
| **3:4** | 448x600 | 747 | 896x1200 | 1120 | 1792x2400 | 1680 | 3584x4800 | 2520 |
| **4:1** | 1024x256 | 747 | 2048x512 | 1120 | 4096x1024 | 1680 | 8192x2048 | 2520 |
| **4:3** | 600x448 | 747 | 1200x896 | 1120 | 2400x1792 | 1680 | 4800x3584 | 2520 |
| **4:5** | 464x576 | 747 | 928x1152 | 1120 | 1856x2304 | 1680 | 3712x4608 | 2520 |
| **5:4** | 576x464 | 747 | 1152x928 | 1120 | 2304x1856 | 1680 | 4608x3712 | 2520 |
| **8:1** | 1536x192 | 747 | 3072x384 | 1120 | 6144x768 | 1680 | 12288x1536 | 2520 |
| **9:16** | 384x688 | 747 | 768x1376 | 1120 | 1536x2752 | 1680 | 3072x5504 | 2520 |
| **16:9** | 688x384 | 747 | 1376x768 | 1120 | 2752x1536 | 1680 | 5504x3072 | 2520 |
| **21:9** | 792x168 | 747 | 1584x672 | 1120 | 3168x1344 | 1680 | 6336x2688 | 2520 |

### 3 Pro Image Preview

| Aspect ratio | 1K resolution | 1K tokens | 2K resolution | 2K tokens | 4K resolution | 4K tokens |
|---|---|---|---|---|---|---|
| **1:1** | 1024x1024 | 1120 | 2048x2048 | 1120 | 4096x4096 | 2000 |
| **2:3** | 848x1264 | 1120 | 1696x2528 | 1120 | 3392x5056 | 2000 |
| **3:2** | 1264x848 | 1120 | 2528x1696 | 1120 | 5056x3392 | 2000 |
| **3:4** | 896x1200 | 1120 | 1792x2400 | 1120 | 3584x4800 | 2000 |
| **4:3** | 1200x896 | 1120 | 2400x1792 | 1120 | 4800x3584 | 2000 |
| **4:5** | 928x1152 | 1120 | 1856x2304 | 1120 | 3712x4608 | 2000 |
| **5:4** | 1152x928 | 1120 | 2304x1856 | 1120 | 4608x3712 | 2000 |
| **9:16** | 768x1376 | 1120 | 1536x2752 | 1120 | 3072x5504 | 2000 |
| **16:9** | 1376x768 | 1120 | 2752x1536 | 1120 | 5504x3072 | 2000 |
| **21:9** | 1584x672 | 1120 | 3168x1344 | 1120 | 6336x2688 | 2000 |

### Gemini 2.5 Flash Image

| Aspect ratio | Resolution | Tokens |
|---|---|---|
| 1:1 | 1024x1024 | 1290 |
| 2:3 | 832x1248 | 1290 |
| 3:2 | 1248x832 | 1290 |
| 3:4 | 864x1184 | 1290 |
| 4:3 | 1184x864 | 1290 |
| 4:5 | 896x1152 | 1290 |
| 5:4 | 1152x896 | 1290 |
| 9:16 | 768x1344 | 1290 |
| 16:9 | 1344x768 | 1290 |
| 21:9 | 1536x672 | 1290 |

## Model selection

Choose the model best suited for your specific use case.

- **Gemini 3.1 Flash Image Preview (Nano Banana 2 Preview)** should be your
  go-to image generation model, as the best all around performance and
  intelligence to cost and latency balance. Check the model [pricing](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.1-flash-image-preview) and [capabilities](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-image-preview) page for more
  details.

- **Gemini 3 Pro Image Preview (Nano Banana Pro Preview)** is designed for
  professional asset production and complex instructions. This model features
  real-world grounding using Google Search, a default "Thinking" process that
  refines composition prior to generation, and can generate images of up to 4K
  resolutions. Check the model [pricing](https://ai.google.dev/gemini-api/docs/pricing#gemini-3-pro-image-preview) and [capabilities](https://ai.google.dev/gemini-api/docs/models/gemini-3-pro-image-preview) page for more
  details.

- **Gemini 2.5 Flash Image (Nano Banana)** is designed for speed and
  efficiency. This model is optimized for high-volume, low-latency tasks and
  generates images at 1024px resolution. Check the model [pricing](https://ai.google.dev/gemini-api/docs/pricing#gemini-2.5-flash-image) and
  [capabilities](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image) page for more
  details.

### When to use Imagen

In addition to using Gemini's built-in image generation capabilities, you can
also access [Imagen](https://ai.google.dev/gemini-api/docs/imagen), our specialized image generation
model, through the Gemini API.

Imagen 4 should be your go-to model when starting to generate images
with Imagen. Choose Imagen 4 Ultra for advanced
use-cases or when you need the best image quality (note that can only generate
one image at a time).

## What's next

- Find more examples and code samples in the [cookbook guide](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_Started_Nano_Banana.ipynb).
- Check out the [Veo guide](https://ai.google.dev/gemini-api/docs/video) to learn how to generate videos with the Gemini API.
- To learn more about Gemini models, see [Gemini models](https://ai.google.dev/gemini-api/docs/models/gemini).


> [!NOTE]
> **Note** : This version of the page covers the new [Interactions API](https://ai.google.dev/gemini-api/docs/interactions), which is currently in Beta.  
> For stable production deployments, we recommend you continue to use the `generateContent` API. You can use the toggle on this page to switch between the versions.


# Nano Banana image generation

Prompt to prototype fully-functional, UI-complete apps, and see Nano Banana 2 integrated with real-world tools, data, and the Gemini ecosystem. All before writing a single line of code.

- Or build your own from prompts:
- ![magazine](https://storage.googleapis.com/generativeai-downloads/images/magazine-2.jpg) ![london](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/05-output.jpg) ![restore](https://storage.googleapis.com/generativeai-downloads/images/quetzal.png) ![banana](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/06-output.jpg) ![cafe](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/02-a-photo-of-an-everyday-scene-at-a-busy-cafe-servin.jpg) ![article](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/10-use-search-to-find-how-the-gemini-3-flash-launch-h.jpg) ![dog](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/01-an-icon-representing-a-cute-dog-the-background-is-.jpg) ![isometric](https://storage.googleapis.com/generativeai-downloads/images/isometric-pool.jpg)
- ![magazine](https://storage.googleapis.com/generativeai-downloads/images/magazine-2.jpg) Generated by Nano Banana 2 **Prompt:** "A photo of a glossy magazine cover, the minimal blue cover has the large bold words Nano Banana. The text is in a serif font and fills the view. No other text. In front of the text there is a portrait of a person in a sleek and minimal dress. She is playfully holding the number 2, which is the focal point.   
  Put the issue number and "Feb 2026" date in the corner along with a barcode. The magazine is on a shelf against an orange plastered wall, within a designer store."
- ![london](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/05-output.jpg) Generated by Nano Banana Pro **Prompt:** "Present a clear, 45° top-down isometric miniature 3D cartoon scene of London, featuring its most iconic landmarks and architectural elements. Use soft, refined textures with realistic PBR materials and gentle, lifelike lighting and shadows. Integrate the current weather conditions directly into the city environment to create an immersive atmospheric mood. Use a clean, minimalistic composition with a soft, solid-colored background. At the top-center, place the title "London" in large bold text, a prominent weather icon beneath it, then the date (small text) and temperature (medium text). All text must be centered with consistent spacing, and may subtly overlap the tops of the buildings."
- ![quetzal](https://storage.googleapis.com/generativeai-downloads/images/quetzal.png) Generated by Nano Banana 2 **Prompt:** "Use image search to find accurate images of a resplendent quetzal bird. Create a beautiful 3:2 wallpaper of this bird, with a natural top to bottom gradient and minimal composition."
- ![banana](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/06.jpg) Generated by Nano Banana Pro **Prompt:** "Put this logo on a high-end ad for a banana scented perfume. The logo is perfectly integrated into the bottle."
- ![cafe](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/02-a-photo-of-an-everyday-scene-at-a-busy-cafe-servin.jpg) Generated by Nano Banana Pro **Prompt:** "A photo of an everyday scene at a busy cafe serving breakfast. In the foreground is an anime man with blue hair, one of the people is a pencil sketch, another is a claymation person"
- ![article](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/10-use-search-to-find-how-the-gemini-3-flash-launch-h.jpg) Generated by Nano Banana Pro **Prompt:** "Use search to find how the Gemini 3 Flash launch has been received. Use this information to write a short article about it (with headings). Return a photo of the article as it appeared in a design focused glossy magazine. It is a photo of a single folded over page, showing the article about Gemini 3 Flash. One hero photo. Headline in serif."
- ![dog](https://storage.googleapis.com/generativeai-downloads/images/Nano%20Banana%20Pro%20outputs%20for%20docs/01-an-icon-representing-a-cute-dog-the-background-is-.jpg) Generated by Nano Banana Pro **Prompt:** "An icon representing a cute dog. The background is white. Make the icons in a colorful and tactile 3D style. No text."
- ![isometric](https://storage.googleapis.com/generativeai-downloads/images/isometric-pool.jpg) Generated by Nano Banana 2 **Prompt:** "Make a photo that is perfectly isometric. It is not a miniature, it is a captured photo that just happened to be perfectly isometric. It is a photo of a beautiful modern garden. There's a large 2 shaped pool and the words: Nano Banana 2."

**Nano Banana** is the name for Gemini's native image generation capabilities.
Gemini can generate and process images conversationally
with text, images, or a combination of both. This lets you create, edit, and
iterate on visuals with unprecedented control.

Nano Banana refers to two distinct models available in the Gemini API:

- **Nano Banana 2** : The [Gemini 3.1 Flash Image Preview](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-image-preview) model (`gemini-3.1-flash-image-preview`). This model serves as the high-efficiency counterpart to Gemini 3 Pro Image, optimized for speed and high-volume developer use cases.
- **Nano Banana Pro** : The [Gemini 3 Pro Image Preview](https://ai.google.dev/gemini-api/docs/models/gemini-3-pro-image-preview) model (`gemini-3-pro-image-preview`). This model is designed for professional asset production, utilizing advanced reasoning ("Thinking") to follow complex instructions and render high-fidelity text.
- **Nano Banana** : The [Gemini 2.5 Flash Image](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image) model (`gemini-2.5-flash-image`). This model is designed for speed and efficiency, optimized for high-volume, low-latency tasks.

All generated images include a [SynthID watermark](https://ai.google.dev/responsible/docs/safeguards/synthid).

## Image generation (text-to-image)

### Python

    from google import genai
    from google.genai import types
    from PIL import Image
    import base64

    client = genai.Client()

    prompt = ("Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme")
    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[prompt],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("generated_image.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const prompt =
        "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: prompt,
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const imageData = contentBlock.data;
              const buffer = Buffer.from(imageData, "base64");
              fs.writeFileSync("gemini-native-image.png", buffer);
              console.log("Image saved as gemini-native-image.png");
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [
          {"type": "text", "text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
        ]
      }'

## Image editing (text-and-image-to-image)

**Reminder** : Make sure you have the necessary rights to any images you upload.
Don't generate content that infringe on others' rights, including videos or
images that deceive, harass, or harm. Your use of this generative AI service is
subject to our [Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy).

Provide an image and use text prompts to add, remove, or modify elements,
change the style, or adjust the color grading.

The following example demonstrates uploading `base64` encoded images.
For multiple images, larger payloads, and supported MIME types, check the [Image
understanding](https://ai.google.dev/gemini-api/docs/interactions/image-understanding) page.

### Python

    from google import genai
    from google.genai import types
    from PIL import Image
    import base64

    client = genai.Client()

    prompt = (
        "Create a picture of my cat eating a nano-banana in a "
        "fancy restaurant under the Gemini constellation",
    )

    image = Image.open("/path/to/cat_image.png")

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[prompt, image],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("generated_image.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {

      const ai = new GoogleGenAI({});

      const imagePath = "path/to/cat_image.png";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const prompt = [
        { text: "Create a picture of my cat eating a nano-banana in a" +
                "fancy restaurant under the Gemini constellation" },
        {
          type: "image",
          mimeType: "image/png",
          data: base64Image
        },
      ];

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: prompt,
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const imageData = contentBlock.data;
              const buffer = Buffer.from(imageData, "base64");
              fs.writeFileSync("gemini-native-image.png", buffer);
              console.log("Image saved as gemini-native-image.png");
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"model\": \"gemini-3.1-flash-image-preview\",
          \"input\": [
            {\"type\": \"text\", \"text\": \"Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation\"},
            {
              \"type\": \"image\",
              \"mime_type\": \"image/jpeg\",
              \"data\": \"<BASE64_IMAGE_DATA>\"
            }
          ]
        }"

### Multi-turn image editing

Keep generating and editing images conversationally. Multi-turn
conversation is the recommended way to iterate on images. The following
example shows a prompt to generate an infographic about photosynthesis.

### Python

    from google import genai
    from google.genai import types
    import base64

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input="Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader.",
        tools=[{"google_search": {}}],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("photosynthesis.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    const ai = new GoogleGenAI({});

    async function main() {
      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader.",
        tools: [{googleSearch: {}}],
      });

      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const imageData = contentBlock.data;
              const buffer = Buffer.from(imageData, "base64");
              fs.writeFileSync("photosynthesis.png", buffer);
              console.log("Image saved as photosynthesis.png");
            }
          }
        }
      }
    }

    await main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [{
          "parts": [
            {"text": "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plants favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids cookbook, suitable for a 4th grader."}
          ]
        }],
        "tools": [{"google_search": {}}]
      }'

![AI-generated infographic about photosynthesis](https://ai.google.dev/static/gemini-api/docs/images/infographic-eng.png) AI-generated infographic about photosynthesis

You can then use the `previous_interaction_id` to change the language on the graphic to Spanish.

### Python

    interaction_2 = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input="Update this infographic to be in Spanish. Do not change any other elements of the image.",
        previous_interaction_id=interaction.id,
        response_format={
            "type": "image",
            "mime_type": "image/png",
            "aspect_ratio": "16:9",
            "image_size": "2K"
        },
    )

    for step in interaction_2.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("photosynthesis_spanish.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    const interaction2 = await ai.interactions.create({
      model: "gemini-3.1-flash-image-preview",
      input: "Update this infographic to be in Spanish. Do not change any other elements of the image.",
      previousInteractionId: interaction.id,
      response_format: {
        type: "image",
        mime_type: "image/png",
        aspect_ratio: "16:9",
        image_size: "2K"
      },
    });

    for (const step of interaction2.steps) {
      if (step.type === "text") {
        console.log(step.text);
      } else if (step.type === "image") {
        const buffer = Buffer.from(step.data, "base64");
        fs.writeFileSync("photosynthesis_spanish.png", buffer);
      }
    }

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [{
          "parts": [{"text": "Update this infographic to be in Spanish. Do not change any other elements of the image."}]
        }],
        "previous_interaction_id": "<PREVIOUS_INTERACTION_ID>",
        "response_format": {
          "type": "image",
          "mime_type": "image/png",
          "aspect_ratio": "16:9",
          "image_size": "2K"
        }
      }'

![AI-generated infographic of photosynthesis in Spanish](https://ai.google.dev/static/gemini-api/docs/images/infographic-spanish.png) AI-generated infographic of photosynthesis in Spanish

## New with Gemini 3 Image models

Gemini 3 offers state-of-the-art image generation and editing models. Gemini 3.1
Flash Image is optimized for speed and high-volume use-cases, and Gemini 3
Pro Image is optimized for professional asset production.
Designed to tackle the most challenging workflows through advanced reasoning,
they excel at complex, multi-turn creation and modification tasks.

- **High-resolution output** : Built-in generation capabilities for 1K, 2K, and 4K visuals.
  - **Gemini 3.1 Flash Image** adds the smaller 512px (0.5K) resolution.
- **Advanced text rendering**: Capable of generating legible, stylized text for infographics, menus, diagrams, and marketing assets.
- **Grounding with Google Search** : The model can use Google Search as a tool to verify facts and generate imagery based on real-time data (e.g., current weather maps, stock charts, recent events).
  - **Gemini 3.1 Flash Image** adds the integration of Google Image Search Grounding alongside Web Search.
- **Thinking mode**: The model utilizes a "thinking" process to reason through complex prompts. It generates interim "thought images" (visible in the backend but not charged) to refine the composition before producing the final high-quality output.
- **Up to 14 reference images**: You can now mix up to 14 reference images to produce the final image.
- **New aspect ratios** : Gemini 3.1 Flash Image Preview adds 1:4, 4:1, 1:8, and 8:1 [aspect ratios](https://ai.google.dev/gemini-api/docs/interactions/image-generation#aspect_ratios_and_image_size).

### Use up to 14 reference images

Gemini 3 image models let you to mix up to 14 reference images. These 14 images
can include the following:

| Gemini 3.1 Flash Image Preview | Gemini 3 Pro Image Preview |
|---|---|
| Up to 10 images of objects with high-fidelity to include in the final image | Up to 6 images of objects with high-fidelity to include in the final image |
| Up to 4 images of characters to maintain character consistency | Up to 5 images of characters to maintain character consistency |

### Python

    from google import genai
    from google.genai import types
    from PIL import Image
    import base64

    prompt = "An office group photo of these people, they are making funny faces."

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[
            prompt,
            Image.open('person1.png'),
            Image.open('person2.png'),
            Image.open('person3.png'),
            Image.open('person4.png'),
            Image.open('person5.png'),
        ],
        response_format={
            "image": {
                "aspect_ratio": "5:4",
                "image_size": "2K"
            }
        },
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("office.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const input = [
        { text: "An office group photo of these people, they are making funny faces." },
        { type: "image", mimeType: "image/jpeg", data: base64ImageFile1 },
        { type: "image", mimeType: "image/jpeg", data: base64ImageFile2 },
        { type: "image", mimeType: "image/jpeg", data: base64ImageFile3 },
        { type: "image", mimeType: "image/jpeg", data: base64ImageFile4 },
        { type: "image", mimeType: "image/jpeg", data: base64ImageFile5 },
      ];

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: input,
        responseFormat: { image: { aspectRatio: "5:4", imageSize: "2K" } },
      });

      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("office.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"model\": \"gemini-3.1-flash-image-preview\",
          \"input\": [
            {\"type\": \"text\", \"text\": \"An office group photo of these people, they are making funny faces.\"},
            {\"type\": \"image\", \"mime_type\": \"image/png\", \"data\": \"<BASE64_DATA_IMG_1>\"},
            {\"type\": \"image\", \"mime_type\": \"image/png\", \"data\": \"<BASE64_DATA_IMG_2>\"},
            {\"type\": \"image\", \"mime_type\": \"image/png\", \"data\": \"<BASE64_DATA_IMG_3>\"},
            {\"type\": \"image\", \"mime_type\": \"image/png\", \"data\": \"<BASE64_DATA_IMG_4>\"},
            {\"type\": \"image\", \"mime_type\": \"image/png\", \"data\": \"<BASE64_DATA_IMG_5>\"}
          ],
          \"response_format\": {
            \"image\": {
              \"aspect_ratio\": \"5:4\",
              \"image_size\": \"2K\"
            }
          }
        }"

![AI-generated office group photo](https://ai.google.dev/static/gemini-api/docs/images/office-group-photo.jpeg) AI-generated office group photo

### Grounding with Google Search

Use the [Google Search tool](https://ai.google.dev/gemini-api/docs/interactions/google-search) to generate images
based on real-time information, such as weather forecasts, stock charts, or
recent events.

Note that when using Grounding with Google Search with image generation,
image-based search results are not passed to the generation model and are
excluded from the response (see [Grounding with Google Image Search](https://ai.google.dev/gemini-api/docs/interactions/image-generation#image-search))

### Python

    from google import genai
    from google.genai import types
    import base64
    prompt = "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day"

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=prompt,
        tools=[{"google_search": {}}],
        response_format={
            "type": "image",
            "mime_type": "image/png",
            "aspect_ratio": "16:9"
        },
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("weather.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day",
        tools: [{ googleSearch: {} }],
        response_format: {
          type: "image",
          mime_type: "image/png",
          aspect_ratio: "16:9",
          image_size: "2K"
        },
      });

      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("weather.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [
          {"type": "text", "text": "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day"}
        ],
        "tools": [{"google_search": {}}],
        "response_format": {
          "type": "image",
          "mime_type": "image/png",
          "aspect_ratio": "16:9"
        }

![AI-generated five day weather chart for San Francisco](https://ai.google.dev/static/gemini-api/docs/images/weather-forecast.png) AI-generated five day weather chart for San Francisco

The response includes `google_search_call` and `google_search_result` steps,
along with inline `url_citation` annotations on the text step:

- **`google_search_result`** : Contains `search_suggestions`, an HTML snippet for rendering search suggestions in your UI.
- **`url_citation` annotations**: Inline citations on the text step linking parts of the response to their web sources.

### Grounding with Google Search for Images (3.1 Flash)

> [!NOTE]
> **Note:** This feature is only available for the Gemini 3.1 Flash Image model.

Grounding with Google Image Search allows models to use web images retrieved via
Google Image Search as visual context for image generation. Image Search is a
new search type within the existing Grounding with Google Search tool,
functioning alongside standard [Web Search](https://ai.google.dev/gemini-api/docs/interactions/image-generation#use-with-grounding).

To enable Image Search, configure the `google_search` tool in your API request
and specify `image_search` within the `search_types` array. Image Search can be
used independently or together with Web Search.

### Python

    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input="A detailed painting of a Timareta butterfly resting on a flower",
        tools=[{
            "google_search": {
                "search_types": ["web_search", "image_search"]
            }
        }]
    )

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    async function main() {
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: "A detailed painting of a Timareta butterfly resting on a flower",
        tools: [{
          googleSearch: {
            searchTypes: ["web_search", "image_search"]
          }
        }]
      });
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": "A detailed painting of a Timareta butterfly resting on a flower",
        "tools": [{"type": "google_search", "search_types": ["web_search", "image_search"]}]
      }'

**Display requirements**

When you use Image Search within Grounding with Google Search, you must display
the `search_suggestions` from the `google_search_result` step. Full usage
requirements are detailed in the
[Terms of Service](https://ai.google.dev/gemini-api/terms#grounding-with-google-search).

**Response**

For grounded responses using image search, the API returns inline citations
and attribution metadata as part of the response steps:

- **`url_citation` annotations** : Inline citations on the text content block
  within `model_output`, linking the generated content to its source.

- **`google_search_result`** : Contains `search_suggestions`, an HTML
  snippet for rendering search suggestions in your UI.

### Generate images up to 4K resolution

Gemini 3 image models generate 1K images by default but can also output 2K,
4K, and 512px (05.K) (Gemini 3.1 Flash Image only) images. To generate higher
resolution assets, specify the `image_size` in the `response_format`.

You must use an uppercase 'K' (e.g. 512px (05.K), 1K, 2K, 4K). Lowercase
parameters (e.g., 1k) will be rejected.

### Python

    from google import genai
    from google.genai import types
    import base64

    prompt = "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English."

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=prompt,
        response_format=[
            {
                "type": "image",
                "mime_type": "image/png",
                "aspect_ratio": "1:1",
                "image_size": "1K"
            }
        ],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("butterfly.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English.",
        response_format: [
          {
            type: "image",
            mime_type: "image/png",
            aspect_ratio: "1:1",
            image_size: "1K",
          }
        ],
      });

      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("butterfly.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [{"parts": [{"text": "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English."}]}],
        "response_format": [
          {
            "type": "image",
            "mime_type": "image/png",
            "aspect_ratio": "1:1",
            "image_size": "1K"
          }
        ]
      }'

The following is an example image generated from this prompt:
![AI-generated Da Vinci style anatomical sketch of a dissected Monarch butterfly.](https://ai.google.dev/static/gemini-api/docs/images/gemini3-4k-image.png) AI-generated Da Vinci style anatomical sketch of a dissected Monarch butterfly.

### Thinking Process

Gemini 3 image models are thinking models that use a reasoning
process ("Thinking") for complex prompts. This feature is enabled by default and
cannot be disabled in the API. To learn more about the thinking process, see
the [Gemini Thinking](https://ai.google.dev/gemini-api/docs/interactions/thinking) guide.

The model generates up to two interim images to test composition and logic. The
last image within Thinking is also the final rendered image.

You can check the thoughts that lead to the final image being produced.

### Python

    for step in interaction.steps:
        if step.type == "thought":
            for content_block in step.summary:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    image = Image.open(io.BytesIO(base64.b64decode(content_block.data)))
                    image.show()

### JavaScript

    for (const step of interaction.steps) {
      if (step.type === "thought") {
        for (const contentBlock of step.summary) {
          if (contentBlock.type === "text") {
            console.log(contentBlock.text);
          } else if (contentBlock.type === "image") {
            const buffer = Buffer.from(contentBlock.data, 'base64');
            fs.writeFileSync('thought_image.png', buffer);
          }
        }
      }
    }

#### Controlling thinking levels

With Gemini 3.1 Flash Image, you can control the amount of thinking the model
uses to balance quality and latency. The default `thinkingLevel` is `minimal`,
and the supported levels are `minimal` and `high`.

You can add the `includeThoughts` boolean to determine whether the model's
generated thoughts are returned in the response, or remain hidden.

### Python

    from google import genai
    from google.genai import types
    import base64
    import io

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input="A futuristic city built inside a giant glass bottle floating in space",
        generation_config={"thinking_level": "High"},
    )

    for step in interaction.steps:
        if step.type == "thought":
          continue
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    image = Image.open(io.BytesIO(base64.b64decode(content_block.data)))
                    image.show()

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: "A futuristic city built inside a giant glass bottle floating in space",
        generationConfig: { thinkingLevel: "High" },
      });

      for (const step of interaction.steps) {
        if (step.type === "thought") continue;
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("image.png", buffer);
            }
          }
        }
      }
    }
    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [{"parts": [{"text": "A futuristic city built inside a giant glass bottle floating in space"}]}],
        "generation_config": {
          "thinking_level": "High"
        }
      }'

Note that thinking tokens are billed regardless of whether `includeThoughts` is
set to `true` or `false`, as the [thinking process](https://ai.google.dev/gemini-api/docs/interactions/image-generation#thinking-process) always
happens by default whether you view the process or not.

## Other image generation modes

Although Nano Banana image generation models are recommended for most use cases,
you can also explore dedicated image generation models:

- **[Imagen](https://ai.google.dev/gemini-api/docs/imagen)**: Google's text-to-image models optimized for generating high-quality images.
- **[Veo](https://ai.google.dev/gemini-api/docs/video)**: Google's video generation model.

## Generate images in batch

All of the image generation capabilities described on this page can also be
run as batch jobs using the [Batch API](https://ai.google.dev/gemini-api/docs/batch).

## Prompting guide and strategies

This section provides prompt examples and templates for common image generation
and editing workflows. Each example includes a re-usable template and a
sample prompt for the Interactions API.

### Prompts for generating images

The following examples show how to use text prompts to generate various types of
images.

#### 1. Photorealistic scenes

Describe a scene in rich detail. The more specific you are, the more control you
have over the results.

### Template

    A photorealistic [type of shot] of a [subject description] in a [setting
    description]. [Description of the light]. Shot from a [camera angle]
    with a [lens type].

### Prompt

    A photorealistic wide-angle shot of a vibrant coral reef teeming with tropical fish. Crystal-clear turquoise water with sunbeams filtering down from the surface, illuminating a sea turtle gliding gracefully over the coral. Shot from a low perspective with a wide-angle lens. Aspect ratio 16:9.

### Python

    from google import genai
    from google.genai import types
    import base64

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input="A photorealistic wide-angle shot of a vibrant coral reef teeming with tropical fish. Crystal-clear turquoise water with sunbeams filtering down from the surface, illuminating a sea turtle gliding gracefully over the coral. Shot from a low perspective with a wide-angle lens. Aspect ratio 16:9.",
        response_format=[
            {
                "type": "image",
                "mime_type": "image/png",
                "aspect_ratio": "16:9",
            }
        ],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("coral_reef.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: "A photorealistic wide-angle shot of a vibrant coral reef teeming with tropical fish. Crystal-clear turquoise water with sunbeams filtering down from the surface, illuminating a sea turtle gliding gracefully over the coral. Shot from a low perspective with a wide-angle lens. Aspect ratio 16:9.",
        response_format: [
          {
            type: "image",
            mime_type: "image/png",
            aspect_ratio: "16:9",
          }
        ],
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("coral_reef.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [{"parts": [{"text": "A photorealistic wide-angle shot of a vibrant coral reef teeming with tropical fish. Crystal-clear turquoise water with sunbeams filtering down from the surface, illuminating a sea turtle gliding gracefully over the coral. Shot from a low perspective with a wide-angle lens. Aspect ratio 16:9."}]}],
        "response_format": {
          "type": "image",
          "mime_type": "image/png",
          "aspect_ratio": "16:9"
        }
      }'

![A photorealistic wide-angle shot of a vibrant coral reef...](https://ai.google.dev/static/gemini-api/docs/images/coral_reef.png) A photorealistic wide-angle shot of a vibrant coral reef...

#### 2. Stylized illustrations \& stickers

Describe the artistic style, subject, and medium. Be specific about the visual
detail (bold lines, colors, etc.) for consistent results.

### Template

    A [style] of a [subject, with details about accessories or actions]
    doing [activity]. The design features [visual qualities, e.g., bold outlines,
    cel-shading, etc.] and [color/background preference].

### Prompt

    A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white.

### Python

    from google import genai
    import base64

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input="A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white.",
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("red_panda_sticker.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: "A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white.",
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("red_panda_sticker.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [{"parts": [{"text": "A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It is munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white."}]}]
      }'

![A kawaii-style sticker of a happy red...](https://ai.google.dev/static/gemini-api/docs/images/red_panda_sticker.png) A kawaii-style sticker of a happy red panda...

#### 3. Accurate text in images

Gemini excels at rendering text. Be clear about the text, the font style
(descriptively), and the overall design. Use Gemini 3 Pro Image Preview for
professional asset production.

### Template

    Create a [image type] for [brand/concept] with the text "[text to render]"
    in a [font style]. The design should be [style description], with a
    [color scheme].

### Prompt

    Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.

### Python

    from google import genai
    import base64

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input="Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.",
        response_format={"type": "image", "aspect_ratio": "1:1"},
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("logo_example.jpg", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: "Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.",
        responseFormat: { type: "image", aspectRatio: "1:1" },
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("logo_example.jpg", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [{"parts": [{"text": "Create a modern, minimalist logo for a coffee shop called The Daily Grind. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way."}]}],
        "response_format": {
          "type": "image",
          "aspect_ratio": "1:1"
        }
      }'

![Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'...](https://ai.google.dev/static/gemini-api/docs/images/logo_example.jpg) Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'...

#### 4. Product mockups \& commercial photography

Perfect for creating clean, professional product shots for ecommerce,
advertising, or branding.

### Template

    A high-resolution, studio-lit product photograph of a [product description]
    on a [background surface/description]. The lighting is a [lighting setup,
    e.g., three-point softbox setup] to [lighting purpose]. The camera angle is
    a [angle type] to showcase [specific feature]. Ultra-realistic, with sharp
    focus on [key detail]. [Aspect ratio].

### Prompt

    A high-resolution, studio-lit product photograph of a minimalist ceramic
    coffee mug in matte black, presented on a polished concrete surface. The
    lighting is a three-point softbox setup designed to create soft, diffused
    highlights and eliminate harsh shadows. The camera angle is a slightly
    elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with
    sharp focus on the steam rising from the coffee. Square image.

### Python

    from google import genai
    import base64

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input="A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image.",
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("product_mockup.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: "A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image.",
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("product_mockup.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [{"parts": [{"text": "A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image."}]}]
      }'

![A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug...](https://ai.google.dev/static/gemini-api/docs/images/product_mockup.png) A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug...

#### 5. Minimalist \& negative space design

Excellent for creating backgrounds for websites, presentations, or marketing
materials where text will be overlaid.

### Template

    A minimalist composition featuring a single [subject] positioned in the
    [bottom-right/top-left/etc.] of the frame. The background is a vast, empty
    [color] canvas, creating significant negative space. Soft, subtle lighting.
    [Aspect ratio].

### Prompt

    A minimalist composition featuring a single, delicate red maple leaf
    positioned in the bottom-right of the frame. The background is a vast, empty
    off-white canvas, creating significant negative space for text. Soft,
    diffused lighting from the top left. Square image.

### Python

    from google import genai
    import base64

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input="A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image.",
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("minimalist_design.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: "A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image.",
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("minimalist_design.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [{"parts": [{"text": "A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image."}]}]
      }'

![A minimalist composition featuring a single, delicate red maple leaf...](https://ai.google.dev/static/gemini-api/docs/images/minimalist_design.png) A minimalist composition featuring a single, delicate red maple leaf...

#### 6. Sequential art (Comic panel / Storyboard)

Builds on character consistency and scene description to create panels for
visual storytelling. For accuracy with text and storytelling ability, these
prompts work best with Gemini 3 Pro and Gemini 3.1 Flash Image Preview.

### Template

    Make a 3 panel comic in a [style]. Put the character in a [type of scene].

### Prompt

    Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene.

### Python

    from google import genai
    from PIL import Image
    import base64

    client = genai.Client()

    image_input = Image.open('/path/to/your/man_in_white_glasses.jpg')
    text_input = "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[text_input, image_input],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("comic_panel.jpg", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const imagePath = "/path/to/your/man_in_white_glasses.jpg";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const input = [
        {text: "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."},
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
      ];

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: input,
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("comic_panel.jpg", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [{"parts": [
          {"text": "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."},
          {"inline_data": {"mime_type": "image/jpeg", "data": "<BASE64_IMAGE_DATA>"}}
        ]}]
      }'

|---|---|
| Input | Output |
| ![Man in white glasses](https://ai.google.dev/static/gemini-api/docs/images/man_in_white_glasses.jpg) Input image | ![Make a 3 panel comic in a gritty, noir art style...](https://ai.google.dev/static/gemini-api/docs/images/comic_panel.jpg) Make a 3 panel comic in a gritty, noir art style... |

#### 7. Grounding with Google Search

Use Google Search to generate images based on recent or real-time information.
This is useful for news, weather, and other time-sensitive topics.

### Prompt

    Make a simple but stylish graphic of last night's Arsenal game in the Champion's League

### Python

    from google import genai
    from google.genai import types
    import base64

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input="Make a simple but stylish graphic of last night's Arsenal game in the Champion's League",
        tools=[{"google_search": {}}],
        response_format={"type": "image", "aspect_ratio": "16:9"},
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("football-score.jpg", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: "Make a simple but stylish graphic of last night's Arsenal game in the Champion's League",
        tools: [{ googleSearch: {} }],
        responseFormat: { type: "image", aspectRatio: "16:9", imageSize: "2K" },
      });

      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("football-score.jpg", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [{"parts": [{"text": "Make a simple but stylish graphic of last nights Arsenal game in the Champions League"}]}],
        "tools": [{"google_search": {}}],
        "response_format": {
          "type": "image",
          "aspect_ratio": "16:9"
        }
      }'

![AI-generated graphic of an Arsenal football score](https://ai.google.dev/static/gemini-api/docs/images/football-score.jpg) AI-generated graphic of an Arsenal football score

### Prompts for editing images

These examples show how to provide images alongside your text prompts for
editing, composition, and style transfer.

#### 1. Adding and removing elements

Provide an image and describe your change. The model will match the original
image's style, lighting, and perspective.

### Template

    Using the provided image of [subject], please [add/remove/modify] [element]
    to/from the scene. Ensure the change is [description of how the change should
    integrate].

### Prompt

    "Using the provided image of my cat, please add a small, knitted wizard hat
    on its head. Make it look like it's sitting comfortably and matches the soft
    lighting of the photo."

### Python

    from google import genai
    from PIL import Image
    import base64

    client = genai.Client()

    image_input = Image.open('/path/to/your/cat_photo.png')
    text_input = """Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off."""

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[text_input, image_input],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("cat_with_hat.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const imagePath = "/path/to/your/cat_photo.png";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const input = [
        { text: "Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off." },
        { inlineData: { mimeType: "image/png", data: base64Image } },
      ];

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: input,
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("cat_with_hat.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"model\": \"gemini-3.1-flash-image-preview\",
          \"input\": [{
            \"parts\":[
                {\"text\": \"Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off.\"},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_IMAGE_DATA>\"}}
            ]
          }]
        }"

|---|---|
| Input | Output |
| :cat: A photorealistic picture of a fluffy ginger cat... | ![Using the provided image of my cat, please add a small, knitted wizard hat...](https://ai.google.dev/static/gemini-api/docs/images/cat_with_hat.png) Using the provided image of my cat, please add a small, knitted wizard hat... |

#### 2. Inpainting (Semantic masking)

Conversationally define a "mask" to edit a specific part of an image while
leaving the rest untouched.

### Template

    Using the provided image, change only the [specific element] to [new
    element/description]. Keep everything else in the image exactly the same,
    preserving the original style, lighting, and composition.

### Prompt

    "Using the provided image of a living room, change only the blue sofa to be
    a vintage, brown leather chesterfield sofa. Keep the rest of the room,
    including the pillows on the sofa and the lighting, unchanged."

### Python

    from google import genai
    from PIL import Image
    import base64

    client = genai.Client()

    living_room_image = Image.open('/path/to/your/living_room.png')
    text_input = """Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged."""

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[living_room_image, text_input],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("living_room_edited.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const imagePath = "/path/to/your/living_room.png";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const input = [
        { inlineData: { mimeType: "image/png", data: base64Image } },
        { text: "Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged." },
      ];

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: input,
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("living_room_edited.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"model\": \"gemini-3.1-flash-image-preview\",
          \"input\": [{
            \"parts\":[
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_IMAGE_DATA>\"}},
                {\"text\": \"Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged.\"}
            ]
          }]
        }"

|---|---|
| Input | Output |
| ![A wide shot of a modern, well-lit living room...](https://ai.google.dev/static/gemini-api/docs/images/living_room.png) A wide shot of a modern, well-lit living room... | ![Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa...](https://ai.google.dev/static/gemini-api/docs/images/living_room_edited.png) Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa... |

#### 3. Style transfer

Provide an image and ask the model to recreate its content in a different
artistic style.

### Template

    Transform the provided photograph of [subject] into the artistic style of [artist/art style]. Preserve the original composition but render it with [description of stylistic elements].

### Prompt

    "Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows."

### Python

    from google import genai
    from PIL import Image
    import base64

    client = genai.Client()

    city_image = Image.open('/path/to/your/city.png')
    text_input = """Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows."""

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[city_image, text_input],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("city_style_transfer.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});
      const imageData = fs.readFileSync("/path/to/your/city.png");
      const base64Image = imageData.toString("base64");

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: [
          { inlineData: { mimeType: "image/png", data: base64Image } },
          { text: "Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows." },
        ],
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("city_style_transfer.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"model\": \"gemini-3.1-flash-image-preview\",
          \"input\": [{
            \"parts\":[
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_IMAGE_DATA>\"}},
                {\"text\": \"Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows.\"}
            ]
          }]
        }"

|---|---|
| Input | Output |
| ![A photorealistic, high-resolution photograph of a busy city street...](https://ai.google.dev/static/gemini-api/docs/images/city.png) A photorealistic, high-resolution photograph of a busy city street... | ![Transform the provided photograph of a modern city street at night...](https://ai.google.dev/static/gemini-api/docs/images/city_style_transfer.png) Transform the provided photograph of a modern city street at night... |

#### 4. Advanced composition: Combining multiple images

Provide multiple images as context to create a new, composite scene. This is
perfect for product mockups or creative collages.

### Template

    Create a new image by combining the elements from the provided images. Take
    the [element from image 1] and place it with/on the [element from image 2].
    The final image should be a [description of the final scene].

### Prompt

    "Create a professional e-commerce fashion photo. Take the blue floral dress
    from the first image and let the woman from the second image wear it.
    Generate a realistic, full-body shot of the woman wearing the dress, with
    the lighting and shadows adjusted to match the outdoor environment."

### Python

    from google import genai
    from PIL import Image
    import base64

    client = genai.Client()

    dress_image = Image.open('/path/to/your/dress.png')
    model_image = Image.open('/path/to/your/model.png')
    text_input = """Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment."""

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[dress_image, model_image, text_input],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("fashion_ecommerce_shot.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const imagePath1 = "/path/to/your/dress.png";
      const imageData1 = fs.readFileSync(imagePath1);
      const base64Image1 = imageData1.toString("base64");
      const imagePath2 = "/path/to/your/model.png";
      const imageData2 = fs.readFileSync(imagePath2);
      const base64Image2 = imageData2.toString("base64");

      const input = [
        { inlineData: { mimeType: "image/png", data: base64Image1 } },
        { inlineData: { mimeType: "image/png", data: base64Image2 } },
        { text: "Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment." },
      ];

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: input,
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("fashion_ecommerce_shot.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"model\": \"gemini-3.1-flash-image-preview\",
          \"input\": [{
            \"parts\":[
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_IMAGE_DATA_1>\"}},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_IMAGE_DATA_2>\"}},
                {\"text\": \"Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment.\"}
            ]
          }]
        }"

|---|---|---|
| Input 1 | Input 2 | Output |
| :dress: A blue floral summer dress on a neutral background | ![Full-body shot of a woman with her hair in a bun...](https://ai.google.dev/static/gemini-api/docs/images/model.png) Full-body shot of a woman with her hair in a bun... | ![A woman wearing a blue floral summer dress in an outdoor setting](https://ai.google.dev/static/gemini-api/docs/images/fashion_ecommerce_shot.png) A woman wearing a blue floral summer dress in an outdoor setting |

#### 5. High-fidelity detail preservation

To ensure critical details (like a face or logo) are preserved during an edit,
describe them in great detail along with your edit request.

### Template

    Using the provided images, place [element from image 2] onto [element from
    image 1]. Ensure that the features of [element from image 1] remain
    completely unchanged. The added element should [description of how the
    element should integrate].

### Prompt

    "Take the first image of the woman with brown hair, blue eyes, and a neutral
    expression. Add the logo from the second image onto her black t-shirt.
    Ensure the woman's face and features remain completely unchanged. The logo
    should look like it's naturally printed on the fabric, following the folds
    of the shirt."

### Python

    from google import genai
    from PIL import Image
    import base64

    client = genai.Client()

    woman_image = Image.open('/path/to/your/woman.png')
    logo_image = Image.open('/path/to/your/logo.png')
    text_input = """Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt."""

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[woman_image, logo_image, text_input],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("woman_with_logo.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const imagePath1 = "/path/to/your/woman.png";
      const imageData1 = fs.readFileSync(imagePath1);
      const base64Image1 = imageData1.toString("base64");
      const imagePath2 = "/path/to/your/logo.png";
      const imageData2 = fs.readFileSync(imagePath2);
      const base64Image2 = imageData2.toString("base64");

      const input = [
        { inlineData: { mimeType: "image/png", data: base64Image1 } },
        { inlineData: { mimeType: "image/png", data: base64Image2 } },
        { text: "Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt." },
      ];

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: input,
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("woman_with_logo.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"model\": \"gemini-3.1-flash-image-preview\",
          \"input\": [{
            \"parts\":[
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_IMAGE_DATA_1>\"}},
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_IMAGE_DATA_2>\"}},
                {\"text\": \"Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt.\"}
            ]
          }]
        }"

|---|---|---|
| Input 1 | Input 2 | Output |
| :woman: A professional headshot of a woman with brown hair and blue eyes... | ![Modern brand identifier with letters G and A](https://ai.google.dev/static/gemini-api/docs/images/logo.png) Modern brand identifier with letters G and A | ![Take the first image of the woman with brown hair, blue eyes, and a neutral expression...](https://ai.google.dev/static/gemini-api/docs/images/woman_with_logo.png) Take the first image of the woman with brown hair, blue eyes, and a neutral expression... |

#### 6. Bring something to life

Upload a rough sketch or drawing and ask the model to refine it into a
finished image.

### Template

    Turn this rough [medium] sketch of a [subject] into a [style description]
    photo. Keep the [specific features] from the sketch but add [new details/materials].

### Prompt

    "Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting."

### Python

    from google import genai
    from PIL import Image
    import base64

    client = genai.Client()

    sketch_image = Image.open('/path/to/your/car_sketch.png')
    text_input = """Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting."""

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[sketch_image, text_input],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("car_photo.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import * as fs from "node:fs";

    async function main() {
      const ai = new GoogleGenAI({});

      const imagePath = "/path/to/your/car_sketch.png";
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const input = [
        { inlineData: { mimeType: "image/png", data: base64Image } },
        { text: "Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting." },
      ];

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: input,
      });
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              fs.writeFileSync("car_photo.png", buffer);
            }
          }
        }
      }
    }

    main();

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"model\": \"gemini-3.1-flash-image-preview\",
          \"input\": [{
            \"parts\":[
                {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_IMAGE_DATA>\"}},
                {\"text\": \"Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting.\"}
            ]
          }]
        }"

|---|---|
| Input | Output |
| ![Sketch of a car](https://ai.google.dev/static/gemini-api/docs/images/car-sketch.jpg) Rough sketch of a car | ![Output showing the final concept car](https://ai.google.dev/static/gemini-api/docs/images/car-photo.jpg) Polished photo of a car |

#### 7. Character consistency: 360 view

You can generate 360-degree views of a character by iteratively prompting for
different angles. For best results, include previously generated images in
subsequent prompts to maintain consistency. For complex poses, include a
reference image of the selected pose.

### Template

    A studio portrait of [person] against [background], [looking forward/in profile looking right/etc.]

### Prompt

    A studio portrait of this man against white, in profile looking right

### Python

    from google import genai
    from PIL import Image
    import base64

    client = genai.Client()

    image_input = Image.open('/path/to/your/man_in_white_glasses.jpg')
    text_input = """A studio portrait of this man against white, in profile looking right"""

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[text_input, image_input],
    )

    for step in interaction.steps:
        if step.type == "model_output":
            for content_block in step.content:
                if content_block.type == "text":
                    print(content_block.text)
                elif content_block.type == "image":
                    with open("man_right_profile.png", "wb") as f:
                        f.write(base64.b64decode(content_block.data))

|---|---|---|
| Input | Output 1 | Output 2 |
| ![Original input of a man in white glasses](https://ai.google.dev/static/gemini-api/docs/images/man_in_white_glasses.jpg) Original image | ![Output of a man in white glasses looking right](https://ai.google.dev/static/gemini-api/docs/images/man_in_white_glasses_looking_right.jpg) Man in white glasses looking right | ![Output of a man in white glasses looking forward](https://ai.google.dev/static/gemini-api/docs/images/man_in_white_glasses_looking_forward.jpg) Man in white glasses looking forward |

### Best Practices

To elevate your results from good to great, incorporate these professional
strategies into your workflow.

- **Be Hyper-Specific:** The more detail you provide, the more control you have. Instead of "fantasy armor," describe it: "ornate elven plate armor, etched with silver leaf patterns, with a high collar and pauldrons shaped like falcon wings."
- **Provide Context and Intent:** Explain the *purpose* of the image. The model's understanding of context will influence the final output. For example, "Create a logo for a high-end, minimalist skincare brand" will yield better results than just "Create a logo."
- **Iterate and Refine:** Don't expect a perfect image on the first try. Use the conversational nature of the model to make small changes. Follow up with prompts like, "That's great, but can you make the lighting a bit warmer?" or "Keep everything the same, but change the character's expression to be more serious."
- **Use Step-by-Step Instructions:** For complex scenes with many elements, break your prompt into steps. "First, create a background of a serene, misty forest at dawn. Then, in the foreground, add a moss-covered ancient stone altar. Finally, place a single, glowing sword on top of the altar."
- **Use "Semantic Negative Prompts":** Instead of saying "no cars," describe the intended scene positively: "an empty, deserted street with no signs of traffic."
- **Control the Camera:** Use photographic and cinematic language to control the composition. Terms like `wide-angle shot`, `macro shot`, `low-angle
  perspective`.

## Limitations

- For best performance, use the following languages: EN, ar-EG, de-DE, es-MX, fr-FR, hi-IN, id-ID, it-IT, ja-JP, ko-KR, pt-BR, ru-RU, ua-UA, vi-VN, zh-CN.
- Image generation does not support audio or video inputs.
- The model won't always follow the exact number of image outputs that the user explicitly asks for.
- `gemini-2.5-flash-image` works best with up to 3 images as input, while `gemini-3-pro-image-preview` supports 5 images with high fidelity, and up to 14 images in total. `gemini-3.1-flash-image-preview` supports character resemblance of up to 4 characters and the fidelity of up to 10 objects in a single workflow.
- When generating text for an image, Gemini works best if you first generate the text and then ask for an image with the text.
- `gemini-3.1-flash-image-preview` Grounding with Google Search does not support using real-world images of people from web search at this time.
- All generated images include a [SynthID watermark](https://ai.google.dev/responsible/docs/safeguards/synthid).

## Optional configurations

You can optionally configure the response modalities and aspect ratio of the
model's output.

### Output types

The model defaults to returning text and image responses.
You can configure the response to return only images without text using
`response_modalities=['image']`.

### Python

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[prompt],
        response_modalities=['image'],
    )

### JavaScript

    const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: prompt,
        responseModalities: ['Image'],
      });

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [
          {"type": "text", "text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
        ],
        "responseModalities": ["Image"]
      }'

### Aspect ratios and image size

The model defaults to matching the output image size to that of your input
image, or otherwise generates 1:1 squares.
You can control the aspect ratio of the output image using the `aspect_ratio`
field under `response_format`.

### Python

    interaction = client.interactions.create(
        model="gemini-3.1-flash-image-preview",
        input=[prompt],
        response_format={
            "image": {
                "aspect_ratio": "16:9",
                "image_size": "2K",
            }
        },
    )

### JavaScript

    const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image-preview",
        input: prompt,
        responseFormat: {
          image: {
            aspectRatio: "16:9",
            imageSize: "2K",
          }
        },
      });

### REST

    curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3.1-flash-image-preview",
        "input": [{"parts": [{"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}]}],
        "response_format": {
          "image": {
            "aspect_ratio": "16:9",
            "image_size": "2K"
          }
        }
      }'

The different ratios available and the size of the image generated are listed in
the following tables:

### 3.1 Flash Image Preview

| Aspect ratio | 512px resolution | 0.5K tokens | 1K resolution | 1K tokens | 2K resolution | 2K tokens | 4K resolution | 4K tokens |
|---|---|---|---|---|---|---|---|---|
| **1:1** | 512x512 | 747 | 1024x1024 | 1120 | 2048x2048 | 1120 | 4096x4096 | 2000 |
| **1:4** | 256x1024 | 747 | 512x2048 | 1120 | 1024x4096 | 1120 | 2048x8192 | 2000 |
| **1:8** | 192x1536 | 747 | 384x3072 | 1120 | 768x6144 | 1120 | 1536x12288 | 2000 |
| **2:3** | 424x632 | 747 | 848x1264 | 1120 | 1696x2528 | 1120 | 3392x5056 | 2000 |
| **3:2** | 632x424 | 747 | 1264x848 | 1120 | 2528x1696 | 1120 | 5056x3392 | 2000 |
| **3:4** | 448x600 | 747 | 896x1200 | 1120 | 1792x2400 | 1120 | 3584x4800 | 2000 |
| **4:1** | 1024x256 | 747 | 2048x512 | 1120 | 4096x1024 | 1120 | 8192x2048 | 2000 |
| **4:3** | 600x448 | 747 | 1200x896 | 1120 | 2400x1792 | 1120 | 4800x3584 | 2000 |
| **4:5** | 464x576 | 747 | 928x1152 | 1120 | 1856x2304 | 1120 | 3712x4608 | 2000 |
| **5:4** | 576x464 | 747 | 1152x928 | 1120 | 2304x1856 | 1120 | 4608x3712 | 2000 |
| **8:1** | 1536x192 | 747 | 3072x384 | 1120 | 6144x768 | 1120 | 12288x1536 | 2000 |
| **9:16** | 384x688 | 747 | 768x1376 | 1120 | 1536x2752 | 1120 | 3072x5504 | 2000 |
| **16:9** | 688x384 | 747 | 1376x768 | 1120 | 2752x1536 | 1120 | 5504x3072 | 2000 |
| **21:9** | 792x168 | 747 | 1584x672 | 1120 | 3168x1344 | 1120 | 6336x2688 | 2000 |

### 3 Pro Image Preview

| Aspect ratio | 1K resolution | 1K tokens | 2K resolution | 2K tokens | 4K resolution | 4K tokens |
|---|---|---|---|---|---|---|
| **1:1** | 1024x1024 | 1120 | 2048x2048 | 1120 | 4096x4096 | 2000 |
| **2:3** | 848x1264 | 1120 | 1696x2528 | 1120 | 3392x5056 | 2000 |
| **3:2** | 1264x848 | 1120 | 2528x1696 | 1120 | 5056x3392 | 2000 |
| **3:4** | 896x1200 | 1120 | 1792x2400 | 1120 | 3584x4800 | 2000 |
| **4:3** | 1200x896 | 1120 | 2400x1792 | 1120 | 4800x3584 | 2000 |
| **4:5** | 928x1152 | 1120 | 1856x2304 | 1120 | 3712x4608 | 2000 |
| **5:4** | 1152x928 | 1120 | 2304x1856 | 1120 | 4608x3712 | 2000 |
| **9:16** | 768x1376 | 1120 | 1536x2752 | 1120 | 3072x5504 | 2000 |
| **16:9** | 1376x768 | 1120 | 2752x1536 | 1120 | 5504x3072 | 2000 |
| **21:9** | 1584x672 | 1120 | 3168x1344 | 1120 | 6336x2688 | 2000 |

### Gemini 2.5 Flash Image

| Aspect ratio | Resolution | Tokens |
|---|---|---|
| 1:1 | 1024x1024 | 1290 |
| 2:3 | 832x1248 | 1290 |
| 3:2 | 1248x832 | 1290 |
| 3:4 | 864x1184 | 1290 |
| 4:3 | 1184x864 | 1290 |
| 4:5 | 896x1152 | 1290 |
| 5:4 | 1152x896 | 1290 |
| 9:16 | 768x1344 | 1290 |
| 16:9 | 1344x768 | 1290 |
| 21:9 | 1536x672 | 1290 |

## Model selection

Choose the model best suited for your specific use case.

- **Gemini 3.1 Flash Image Preview (Nano Banana 2 Preview)** should be your
  go-to image generation model, as the best all around performance and
  intelligence to cost and latency balance. Check the model [pricing](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.1-flash-image-preview) and [capabilities](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-image-preview) page for more
  details.

- **Gemini 3 Pro Image Preview (Nano Banana Pro Preview)** is designed for
  professional asset production and complex instructions. This model features
  real-world grounding using Google Search, a default "Thinking" process that
  refines composition prior to generation, and can generate images of up to 4K
  resolutions. Check the model [pricing](https://ai.google.dev/gemini-api/docs/pricing#gemini-3-pro-image-preview) and [capabilities](https://ai.google.dev/gemini-api/docs/models/gemini-3-pro-image-preview) page for more
  details.

- **Gemini 2.5 Flash Image (Nano Banana)** is designed for speed and
  efficiency. This model is optimized for high-volume, low-latency tasks and
  generates images at 1024px resolution. Check the model [pricing](https://ai.google.dev/gemini-api/docs/pricing#gemini-2.5-flash-image) and
  [capabilities](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image) page for more
  details.

### When to use Imagen

In addition to using Gemini's built-in image generation capabilities, you can
also access [Imagen](https://ai.google.dev/gemini-api/docs/imagen), our specialized image generation
model, through the Gemini API.

Imagen 4 should be your go-to model when starting to generate images
with Imagen. Choose Imagen 4 Ultra for advanced
use-cases or when you need the best image quality (note that can only generate
one image at a time).

## What's next

- Check out the [Veo guide](https://ai.google.dev/gemini-api/docs/video) to learn how to generate videos with the Gemini API.
- To learn more about Gemini models, see [Gemini models](https://ai.google.dev/gemini-api/docs/models/gemini).


# Structured outputs

> [!NOTE]
> **Note** : This version of the page covers the new [Interactions API](https://ai.google.dev/gemini-api/docs/interactions), which is currently in Beta.  
> For stable production deployments, we recommend you continue to use the `generateContent` API. You can use the toggle on this page to switch between the versions.

You can configure Gemini models to generate responses that adhere to a provided
JSON Schema. This ensures predictable, type-safe results and simplifies
extracting structured data from unstructured text.

Using structured outputs is ideal for:

- **Data extraction:** Pull specific information like names and dates from text.
- **Structured classification:** Classify text into predefined categories.
- **Agentic workflows:** Generate structured inputs for tools or APIs.

In addition to supporting JSON Schema in the REST API, the Google GenAI SDKs
allow defining schemas using
[Pydantic](https://docs.pydantic.dev/latest/) (Python) and
[Zod](https://zod.dev/) (JavaScript).

<button value="recipe" default="">Recipe Extractor</button> <button value="feedback">Content Moderation</button> <button value="recursive">Recursive Structures</button>

This example demonstrates how to extract structured data from text using basic
JSON Schema types like `object`, `array`, `string`, and `integer`.

### Python

    from google import genai
    from pydantic import BaseModel, Field
    from typing import List, Optional

    class Ingredient(BaseModel):
        name: str = Field(description="Name of the ingredient.")
        quantity: str = Field(description="Quantity of the ingredient, including units.")

    class Recipe(BaseModel):
        recipe_name: str = Field(description="The name of the recipe.")
        prep_time_minutes: Optional[int] = Field(description="Optional time in minutes to prepare the recipe.")
        ingredients: List[Ingredient]
        instructions: List[str]

    client = genai.Client()

    prompt = """
    Please extract the recipe from the following text.
    The user wants to make delicious chocolate chip cookies.
    They need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,
    1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,
    3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.
    For the best part, they'll need 2 cups of semisweet chocolate chips.
    First, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,
    baking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar
    until light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry
    ingredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons
    onto ungreased baking sheets and bake for 9 to 11 minutes.
    """

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": Recipe.model_json_schema()
        },
    )

    recipe = Recipe.model_validate_json(interaction.steps[-1].content[0].text)
    print(recipe)

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import { z } from "zod";
    import { zodToJsonSchema } from "zod-to-json-schema";

    const ingredientSchema = z.object({
      name: z.string().describe("Name of the ingredient."),
      quantity: z.string().describe("Quantity of the ingredient, including units."),
    });

    const recipeSchema = z.object({
      recipe_name: z.string().describe("The name of the recipe."),
      prep_time_minutes: z.number().optional().describe("Optional time in minutes to prepare the recipe."),
      ingredients: z.array(ingredientSchema),
      instructions: z.array(z.string()),
    });

    const client = new GoogleGenAI({});

    const prompt = `
    Please extract the recipe from the following text.
    The user wants to make delicious chocolate chip cookies.
    They need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,
    1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,
    3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.
    For the best part, they'll need 2 cups of semisweet chocolate chips.
    First, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,
    baking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar
    until light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry
    ingredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons
    onto ungreased baking sheets and bake for 9 to 11 minutes.
    `;

    const interaction = await client.interactions.create({
      model: "gemini-3-flash-preview",
      input: prompt,
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: zodToJsonSchema(recipeSchema)
      },
    });

    const recipe = recipeSchema.parse(JSON.parse(interaction.steps.at(-1).content[0].text));
    console.log(recipe);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-3-flash-preview",
          "input": "Please extract the recipe from the following text.\nThe user wants to make delicious chocolate chip cookies.\nThey need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,\n1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,\n3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.\nFor the best part, they will need 2 cups of semisweet chocolate chips.\nFirst, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,\nbaking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar\nuntil light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry\ningredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons\nonto ungreased baking sheets and bake for 9 to 11 minutes.",
          "response_format": {
            "type": "text",
            "mime_type": "application/json",
            "schema": {
              "type": "object",
              "properties": {
                "recipe_name": {
                  "type": "string",
                  "description": "The name of the recipe."
                },
                "prep_time_minutes": {
                    "type": "integer",
                    "description": "Optional time in minutes to prepare the recipe."
                },
                "ingredients": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "name": { "type": "string", "description": "Name of the ingredient."},
                      "quantity": { "type": "string", "description": "Quantity of the ingredient, including units."}
                    },
                    "required": ["name", "quantity"]
                  }
                },
                "instructions": {
                  "type": "array",
                  "items": { "type": "string" }
                }
              },
              "required": ["recipe_name", "ingredients", "instructions"]
            }
          }
          }
        }'

**Example Response:**

    {
      "recipe_name": "Delicious Chocolate Chip Cookies",
      "ingredients": [
        { "name": "all-purpose flour", "quantity": "2 and 1/4 cups" },
        { "name": "baking soda", "quantity": "1 teaspoon" },
        { "name": "salt", "quantity": "1 teaspoon" },
        { "name": "unsalted butter (softened)", "quantity": "1 cup" },
        { "name": "granulated sugar", "quantity": "3/4 cup" },
        { "name": "packed brown sugar", "quantity": "3/4 cup" },
        { "name": "vanilla extract", "quantity": "1 teaspoon" },
        { "name": "large eggs", "quantity": "2" },
        { "name": "semisweet chocolate chips", "quantity": "2 cups" }
      ],
      "instructions": [
        "Preheat the oven to 375°F (190°C).",
        "In a small bowl, whisk together the flour, baking soda, and salt.",
        "In a large bowl, cream together the butter, granulated sugar, and brown sugar until light and fluffy.",
        "Beat in the vanilla and eggs, one at a time.",
        "Gradually beat in the dry ingredients until just combined.",
        "Stir in the chocolate chips.",
        "Drop by rounded tablespoons onto ungreased baking sheets and bake for 9 to 11 minutes."
      ]
    }

## Streaming results

You can stream structured outputs, allowing you to start processing the
response as it's being generated. The streamed chunks are valid partial JSON
strings that can be concatenated to form the final JSON object.

### Python

    from google import genai
    from pydantic import BaseModel
    from typing import Literal

    class Feedback(BaseModel):
        sentiment: Literal["positive", "neutral", "negative"]
        summary: str

    client = genai.Client()
    prompt = "The new UI is incredibly intuitive. Add a very long summary to test streaming!"

    stream = client.interactions.create(
        model="gemini-3-flash-preview",
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": Feedback.model_json_schema()
        },
        stream=True
    )
    for event in stream:
        if event.event_type == "step.delta" and event.delta.text:
            print(event.delta.text, end="")

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import { z } from "zod";
    import { zodToJsonSchema } from "zod-to-json-schema";

    const client = new GoogleGenAI({});
    const feedbackSchema = z.object({
      sentiment: z.enum(["positive", "neutral", "negative"]),
      summary: z.string(),
    });

    const stream = await client.interactions.create({
      model: "gemini-3-flash-preview",
      input: "The new UI is incredibly intuitive. Add a very long summary!",
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: zodToJsonSchema(feedbackSchema)
      },
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === "step.delta" && event.delta?.text) {
        process.stdout.write(event.delta.text);
      }
    }

## Structured outputs with tools

> [!WARNING]
> **Preview:** This feature is available only to Gemini 3 series models.

Gemini 3 lets you combine Structured Outputs with built-in tools, including
[Grounding with Google Search](https://ai.google.dev/gemini-api/docs/interactions/google-search),
[URL Context](https://ai.google.dev/gemini-api/docs/interactions/url-context),
[Code Execution](https://ai.google.dev/gemini-api/docs/interactions/code-execution),
[File Search](https://ai.google.dev/gemini-api/docs/interactions/file-search#structured-output), and
[Function Calling](https://ai.google.dev/gemini-api/docs/interactions/function-calling).

### Python

    from google import genai
    from pydantic import BaseModel, Field
    from typing import List

    class MatchResult(BaseModel):
        winner: str = Field(description="The name of the winner.")
        final_match_score: str = Field(description="The final match score.")
        scorers: List[str] = Field(description="The name of the scorer.")

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3.1-pro-preview",
        input="Search for all details for the latest Euro.",
        tools=[{"type": "google_search"}, {"type": "url_context"}],
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": MatchResult.model_json_schema()
        },
    )

    result = MatchResult.model_validate_json(interaction.steps[-1].content[0].text)
    print(result)

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import { z } from "zod";
    import { zodToJsonSchema } from "zod-to-json-schema";

    const client = new GoogleGenAI({});
    const matchSchema = z.object({
      winner: z.string().describe("The name of the winner."),
      final_match_score: z.string().describe("The final score."),
      scorers: z.array(z.string()).describe("The name of the scorer.")
    });

    const interaction = await client.interactions.create({
      model: "gemini-3.1-pro-preview",
      input: "Search for all details for the latest Euro.",
      tools: [{type: "google_search"}, {type: "url_context"}],
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: zodToJsonSchema(matchSchema)
      },
    });

    const match = matchSchema.parse(JSON.parse(interaction.steps.at(-1).content[0].text));
    console.log(match);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3.1-pro-preview",
        "input": "Search for all details for the latest Euro.",
        "tools": [{"type": "google_search"}, {"type": "url_context"}],
        "response_format": {
          "type": "text",
          "mime_type": "application/json",
          "schema": {
            "type": "object",
            "properties": {
                "winner": {"type": "string"},
                "final_match_score": {"type": "string"},
                "scorers": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["winner", "final_match_score", "scorers"]
          }
        }
      }'

## JSON schema support

To generate a JSON object, configure `response_format` with an object (or an array containing an object) of type `text` and set its `mime_type` to `application/json`. The schema should be provided in the `schema` field.

Gemini's structured output mode supports a subset of the
[JSON Schema](https://json-schema.org/) specification.

The following values of `type` are supported:

- **`string`**: For text.
- **`number`**: For floating-point numbers.
- **`integer`**: For whole numbers.
- **`boolean`**: For true or false values.
- **`object`**: For structured data with key-value pairs.
- **`array`**: For lists of items.
- **`null`** : To allow a property to be null, include `"null"` in the type array (e.g., `{"type": ["string", "null"]}`).

These descriptive properties help guide the model:

- **`title`**: A short description of a property.
- **`description`**: A longer and more detailed description of a property.

### Type-specific properties

**For `object` values:**

- **`properties`**: An object where each key is a property name and each value is a schema for that property.
- **`required`**: An array of strings, listing which properties are mandatory.
- **`additionalProperties`** : Controls whether properties not listed in `properties` are allowed. Can be a boolean or a schema.

**For `string` values:**

- **`enum`**: Lists a specific set of possible strings for classification tasks.
- **`format`** : Specifies a syntax for the string, such as `date-time`, `date`, `time`.

**For `number` and `integer` values:**

- **`enum`**: Lists a specific set of possible numeric values.
- **`minimum`**: The minimum inclusive value.
- **`maximum`**: The maximum inclusive value.

**For `array` values:**

- **`items`**: Defines the schema for all items in the array.
- **`prefixItems`**: Defines a list of schemas for the first N items, allowing for tuple-like structures.
- **`minItems`**: The minimum number of items in the array.
- **`maxItems`**: The maximum number of items in the array.

## Model support

| Model | Structured Outputs |
|---|---|
| Gemini 3.1 Pro Preview | ✔️ |
| Gemini 3 Flash Preview | ✔️ |
| Gemini 2.5 Pro | ✔️ |
| Gemini 2.5 Flash | ✔️ |
| Gemini 2.5 Flash-Lite | ✔️ |
| Gemini 2.0 Flash | ✔️\* |
| Gemini 2.0 Flash-Lite | ✔️\* |

*\* Gemini 2.0 requires an explicit `propertyOrdering` list.*

## Structured outputs versus function calling

| Feature | Primary Use Case |
|---|---|
| **Structured Outputs** | **Formatting the final response.** Use when you want the model's *answer* in a specific format. |
| **Function Calling** | **Taking action during conversation.** Use when the model needs to *ask you* to perform a task before providing a final answer. |

## Best practices

- **Clear descriptions:** Use the `description` field to guide the model.
- **Strong typing:** Use specific types (`integer`, `string`, `enum`).
- **Prompt engineering:** Clearly state what you want the model to do.
- **Validation:** While output is syntactically correct JSON, always validate values in your application.
- **Error handling:** Implement robust error handling for schema-compliant but semantically incorrect outputs.

## Limitations

- **Schema subset:** Not all JSON Schema features are supported.
- **Schema complexity:** Very large or deeply nested schemas may be rejected.

# Structured outputs

You can configure Gemini models to generate responses that adhere to a provided JSON
Schema. This ensures predictable, type-safe results and simplifies extracting
structured data from unstructured text.

Using structured outputs is ideal for:

- **Data extraction:** Pull specific information like names and dates from text.
- **Structured classification:** Classify text into predefined categories.
- **Agentic workflows:** Generate structured inputs for tools or APIs.

In addition to supporting JSON Schema in the REST API, the Google GenAI SDKs
make it easy to define schemas using
[Pydantic](https://docs.pydantic.dev/latest/) (Python) and
[Zod](https://zod.dev/) (JavaScript).

<button value="recipe" default="">Recipe Extractor</button> <button value="feedback">Content Moderation</button> <button value="recursive">Recursive Structures</button>

This example demonstrates how to extract structured data from text using basic
JSON Schema types like `object`, `array`, `string`, and `integer`.

### Python

    from google import genai
    from pydantic import BaseModel, Field
    from typing import List, Optional

    class Ingredient(BaseModel):
        name: str = Field(description="Name of the ingredient.")
        quantity: str = Field(description="Quantity of the ingredient, including units.")

    class Recipe(BaseModel):
        recipe_name: str = Field(description="The name of the recipe.")
        prep_time_minutes: Optional[int] = Field(description="Optional time in minutes to prepare the recipe.")
        ingredients: List[Ingredient]
        instructions: List[str]

    client = genai.Client()

    prompt = """
    Please extract the recipe from the following text.
    The user wants to make delicious chocolate chip cookies.
    They need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,
    1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,
    3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.
    For the best part, they'll need 2 cups of semisweet chocolate chips.
    First, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,
    baking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar
    until light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry
    ingredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons
    onto ungreased baking sheets and bake for 9 to 11 minutes.
    """

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
        config={
            "response_format": {"text": {"mime_type": "application/json", "schema": Recipe.model_json_schema()}},
        },
    )

    recipe = Recipe.model_validate_json(response.text)
    print(recipe)

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import { z } from "zod";
    import { zodToJsonSchema } from "zod-to-json-schema";

    const ingredientSchema = z.object({
      name: z.string().describe("Name of the ingredient."),
      quantity: z.string().describe("Quantity of the ingredient, including units."),
    });

    const recipeSchema = z.object({
      recipe_name: z.string().describe("The name of the recipe."),
      prep_time_minutes: z.number().optional().describe("Optional time in minutes to prepare the recipe."),
      ingredients: z.array(ingredientSchema),
      instructions: z.array(z.string()),
    });

    const ai = new GoogleGenAI({});

    const prompt = `
    Please extract the recipe from the following text.
    The user wants to make delicious chocolate chip cookies.
    They need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,
    1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,
    3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.
    For the best part, they'll need 2 cups of semisweet chocolate chips.
    First, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,
    baking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar
    until light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry
    ingredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons
    onto ungreased baking sheets and bake for 9 to 11 minutes.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseFormat: { text: { mimeType: "application/json", schema: zodToJsonSchema(recipeSchema) } },
      },
    });

    const recipe = recipeSchema.parse(JSON.parse(response.text));
    console.log(recipe);

### Go

    package main

    import (
        "context"
        "fmt"
        "log"

        "google.golang.org/genai"
    )

    func main() {
        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        prompt := `
      Please extract the recipe from the following text.
      The user wants to make delicious chocolate chip cookies.
      They need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,
      1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,
      3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.
      For the best part, they'll need 2 cups of semisweet chocolate chips.
      First, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,
      baking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar
      until light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry
      ingredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons
      onto ungreased baking sheets and bake for 9 to 11 minutes.
      `
        config := &genai.GenerateContentConfig{
            ResponseMIMEType: "application/json",
            ResponseJsonSchema: map[string]any{
                "type": "object",
                "properties": map[string]any{
                    "recipe_name": map[string]any{
                        "type":        "string",
                        "description": "The name of the recipe.",
                    },
                    "prep_time_minutes": map[string]any{
                        "type":        "integer",
                        "description": "Optional time in minutes to prepare the recipe.",
                    },
                    "ingredients": map[string]any{
                        "type": "array",
                        "items": map[string]any{
                            "type": "object",
                            "properties": map[string]any{
                                "name": map[string]any{
                                    "type":        "string",
                                    "description": "Name of the ingredient.",
                                },
                                "quantity": map[string]any{
                                    "type":        "string",
                                    "description": "Quantity of the ingredient, including units.",
                                },
                            },
                            "required": []string{"name", "quantity"},
                        },
                    },
                    "instructions": map[string]any{
                        "type":  "array",
                        "items": map[string]any{"type": "string"},
                    },
                },
                "required": []string{"recipe_name", "ingredients", "instructions"},
            },
        }

        result, err := client.Models.GenerateContent(
            ctx,
            "gemini-3-flash-preview",
            genai.Text(prompt),
            config,
        )
        if err != nil {
            log.Fatal(err)
        }
        fmt.Println(result.Text())
    }

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "contents": [{
            "parts":[
              { "text": "Please extract the recipe from the following text.\nThe user wants to make delicious chocolate chip cookies.\nThey need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,\n1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,\n3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.\nFor the best part, they will need 2 cups of semisweet chocolate chips.\nFirst, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,\nbaking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar\nuntil light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry\ningredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons\nonto ungreased baking sheets and bake for 9 to 11 minutes." }
            ]
          }],
          "generationConfig": {
            "responseFormat": {
              "text": {
                "mimeType": "application/json",
                "schema": {
              "type": "object",
              "properties": {
                "recipe_name": {
                  "type": "string",
                  "description": "The name of the recipe."
                },
                "prep_time_minutes": {
                    "type": "integer",
                    "description": "Optional time in minutes to prepare the recipe."
                },
                "ingredients": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "name": { "type": "string", "description": "Name of the ingredient."},
                      "quantity": { "type": "string", "description": "Quantity of the ingredient, including units."}
              }
            }
          },
                    "required": ["name", "quantity"]
                  }
                },
                "instructions": {
                  "type": "array",
                  "items": { "type": "string" }
                }
              },
              "required": ["recipe_name", "ingredients", "instructions"]
            }
          }
        }'

**Example Response:**

    {
      "recipe_name": "Delicious Chocolate Chip Cookies",
      "ingredients": [
        {
          "name": "all-purpose flour",
          "quantity": "2 and 1/4 cups"
        },
        {
          "name": "baking soda",
          "quantity": "1 teaspoon"
        },
        {
          "name": "salt",
          "quantity": "1 teaspoon"
        },
        {
          "name": "unsalted butter (softened)",
          "quantity": "1 cup"
        },
        {
          "name": "granulated sugar",
          "quantity": "3/4 cup"
        },
        {
          "name": "packed brown sugar",
          "quantity": "3/4 cup"
        },
        {
          "name": "vanilla extract",
          "quantity": "1 teaspoon"
        },
        {
          "name": "large eggs",
          "quantity": "2"
        },
        {
          "name": "semisweet chocolate chips",
          "quantity": "2 cups"
        }
      ],
      "instructions": [
        "Preheat the oven to 375°F (190°C).",
        "In a small bowl, whisk together the flour, baking soda, and salt.",
        "In a large bowl, cream together the butter, granulated sugar, and brown sugar until light and fluffy.",
        "Beat in the vanilla and eggs, one at a time.",
        "Gradually beat in the dry ingredients until just combined.",
        "Stir in the chocolate chips.",
        "Drop by rounded tablespoons onto ungreased baking sheets and bake for 9 to 11 minutes."
      ]
    }

## Streaming

You can stream structured outputs, which allows you to start processing the
response as it's being generated, without having to wait for the entire output
to be complete. This can improve the perceived performance of your application.

The streamed chunks will be valid partial JSON strings, which can be
concatenated to form the final, complete JSON object.

### Python

    from google import genai
    from pydantic import BaseModel, Field
    from typing import Literal

    class Feedback(BaseModel):
        sentiment: Literal["positive", "neutral", "negative"]
        summary: str

    client = genai.Client()
    prompt = "The new UI is incredibly intuitive and visually appealing. Great job. Add a very long summary to test streaming!"

    response_stream = client.models.generate_content_stream(
        model="gemini-3-flash-preview",
        contents=prompt,
        config={
            "response_format": {"text": {"mime_type": "application/json", "schema": Feedback.model_json_schema()}},
        },
    )

    for chunk in response_stream:
        print(chunk.candidates[0].content.parts[0].text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import { z } from "zod";
    import { zodToJsonSchema } from "zod-to-json-schema";

    const ai = new GoogleGenAI({});
    const prompt = "The new UI is incredibly intuitive and visually appealing. Great job! Add a very long summary to test streaming!";

    const feedbackSchema = z.object({
      sentiment: z.enum(["positive", "neutral", "negative"]),
      summary: z.string(),
    });

    const stream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseFormat: { text: { mimeType: "application/json", schema: zodToJsonSchema(feedbackSchema) } },
      },
    });

    for await (const chunk of stream) {
      console.log(chunk.candidates[0].content.parts[0].text)
    }

## Structured outputs with tools

> [!WARNING]
> **Preview:** This feature is available only to Gemini 3 series models, `gemini-3.1-pro-preview` and `gemini-3-flash-preview`.

Gemini 3 lets you combine Structured Outputs with built-in tools, including
[Grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search),
[URL Context](https://ai.google.dev/gemini-api/docs/url-context),
[Code Execution](https://ai.google.dev/gemini-api/docs/code-execution),
[File Search](https://ai.google.dev/gemini-api/docs/file-search#structured-output), and
[Function Calling](https://ai.google.dev/gemini-api/docs/function-calling).

### Python

    from google import genai
    from pydantic import BaseModel, Field
    from typing import List

    class MatchResult(BaseModel):
        winner: str = Field(description="The name of the winner.")
        final_match_score: str = Field(description="The final match score.")
        scorers: List[str] = Field(description="The name of the scorer.")

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3.1-pro-preview",
        contents="Search for all details for the latest Euro.",
        config={
            "tools": [
                {"google_search": {}},
                {"url_context": {}}
            ],
            "response_format": {"text": {"mime_type": "application/json", "schema": MatchResult.model_json_schema()}},
        },  
    )

    result = MatchResult.model_validate_json(response.text)
    print(result)

### JavaScript

    import { GoogleGenAI } from "@google/genai";
    import { z } from "zod";
    import { zodToJsonSchema } from "zod-to-json-schema";

    const ai = new GoogleGenAI({});

    const matchSchema = z.object({
      winner: z.string().describe("The name of the winner."),
      final_match_score: z.string().describe("The final score."),
      scorers: z.array(z.string()).describe("The name of the scorer.")
    });

    async function run() {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: "Search for all details for the latest Euro.",
        config: {
          tools: [
            { googleSearch: {} },
            { urlContext: {} }
          ],
          responseFormat: { text: { mimeType: "application/json", schema: zodToJsonSchema(matchSchema) } },
        },
      });

      const match = matchSchema.parse(JSON.parse(response.text));
      console.log(match);
    }

    run();

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [{
          "parts": [{"text": "Search for all details for the latest Euro."}]
        }],
        "tools": [
          {"googleSearch": {}},
          {"urlContext": {}}
        ],
        "generationConfig": {
            "responseFormat": {
              "text": {
                "mimeType": "application/json",
                "schema": {
                "type": "object",
                "properties": {
                    "winner": {"type": "string", "description": "The name of the winner."},
                    "final_match_score": {"type": "string", "description": "The final score."},
                    "scorers": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "The name of the scorer."
                    }
              }
            }
          },
                "required": ["winner", "final_match_score", "scorers"]
            }
        }
      }'

## JSON schema support

To generate a JSON object, set the `response_format` in the generation configuration. The schema must be a valid [JSON Schema](https://json-schema.org/) that describes the desired output format.

The model will then generate a response that is a syntactically valid JSON string matching the provided schema. When using structured outputs, the model will produce outputs in the same order as the keys in the schema.

Gemini's structured output mode supports a subset of the [JSON Schema](https://json-schema.org) specification.

The following values of `type` are supported:

- **`string`**: For text.
- **`number`**: For floating-point numbers.
- **`integer`**: For whole numbers.
- **`boolean`**: For true/false values.
- **`object`**: For structured data with key-value pairs.
- **`array`**: For lists of items.
- **`null`** : To allow a property to be null, include `"null"` in the type array (e.g., `{"type": ["string", "null"]}`).

These descriptive properties help guide the model:

- **`title`**: A short description of a property.
- **`description`**: A longer and more detailed description of a property.

### Type-specific properties

**For `object` values:**

- **`properties`**: An object where each key is a property name and each value is a schema for that property.
- **`required`**: An array of strings, listing which properties are mandatory.
- **`additionalProperties`** : Controls whether properties not listed in `properties` are allowed. Can be a boolean or a schema.

**For `string` values:**

- **`enum`**: Lists a specific set of possible strings for classification tasks.
- **`format`** : Specifies a syntax for the string, such as `date-time`, `date`, `time`.

**For `number` and `integer` values:**

- **`enum`**: Lists a specific set of possible numeric values.
- **`minimum`**: The minimum inclusive value.
- **`maximum`**: The maximum inclusive value.

**For `array` values:**

- **`items`**: Defines the schema for all items in the array.
- **`prefixItems`**: Defines a list of schemas for the first N items, allowing for tuple-like structures.
- **`minItems`**: The minimum number of items in the array.
- **`maxItems`**: The maximum number of items in the array.

## Model support

The following models support structured output:

| Model | Structured Outputs |
|---|---|
| Gemini 3.1 Flash-Lite | ✔️ |
| Gemini 3.1 Pro Preview | ✔️ |
| Gemini 3 Flash Preview | ✔️ |
| Gemini 3.1 Flash-Lite Preview | ✔️ |
| Gemini 2.5 Pro | ✔️ |
| Gemini 2.5 Flash | ✔️ |
| Gemini 2.5 Flash-Lite | ✔️ |
| Gemini 2.0 Flash | ✔️\* |
| Gemini 2.0 Flash-Lite | ✔️\* |

*\* Note that Gemini 2.0 requires an explicit `propertyOrdering` list within the JSON input to define the preferred structure. You can find an example in this [cookbook](https://github.com/google-gemini/cookbook/blob/main/examples/Pdf_structured_outputs_on_invoices_and_forms.ipynb).*

## Structured outputs vs. function calling

Both structured outputs and function calling use JSON schemas, but they serve different purposes:

| Feature | Primary Use Case |
|---|---|
| **Structured Outputs** | **Formatting the final response to the user.** Use this when you want the model's *answer* to be in a specific format (e.g., extracting data from a document to save to a database). |
| **Function Calling** | **Taking action during the conversation.** Use this when the model needs to *ask you* to perform a task (e.g., "get current weather") before it can provide a final answer. |

## Best practices

- **Clear descriptions:** Use the `description` field in your schema to provide clear instructions to the model about what each property represents. This is crucial for guiding the model's output.
- **Strong typing:** Use specific types (`integer`, `string`, `enum`) whenever possible. If a parameter has a limited set of valid values, use an `enum`.
- **Prompt engineering:** Clearly state in your prompt what you want the model to do. For example, "Extract the following information from the text..." or "Classify this feedback according to the provided schema...".
- **Validation:** While structured output guarantees syntactically correct JSON, it does not guarantee the values are semantically correct. Always validate the final output in your application code before using it.
- **Error handling:** Implement robust error handling in your application to gracefully manage cases where the model's output, while schema-compliant, may not meet your business logic requirements.

## Limitations

- **Schema subset:** Not all features of the JSON Schema specification are supported. The model ignores unsupported properties.
- **Schema complexity:** The API may reject very large or deeply nested schemas. If you encounter errors, try simplifying your schema by shortening property names, reducing nesting, or limiting the number of constraints.

# Function calling with the Gemini API

Function calling lets you connect models to external tools and APIs.
Instead of generating text responses, the model determines when to call specific
functions and provides the necessary parameters to execute real-world actions.
This allows the model to act as a bridge between natural language and real-world
actions and data. Function calling has 3 primary use cases:

- **Augment Knowledge:** Access information from external sources like databases, APIs, and knowledge bases.
- **Extend Capabilities:** Use external tools to perform computations and extend the limitations of the model, such as using a calculator or creating charts.
- **Take Actions:** Interact with external systems using APIs, such as scheduling appointments, creating invoices, sending emails, or controlling smart home devices.

> [!NOTE]
> **Important:** Gemini 3 model APIs now generate a unique `id` for every function call. If you are manually constructing the conversation history or using the REST API, when returning the result of your executed function to the model we recommend passing the matching `id` in your `functionResponse`. If you are using the standard Python or Node.js SDKs, this is handled automatically.

<button value="weather">Get Weather</button> <button value="meeting" default="">Schedule Meeting</button> <button value="chart">Create Chart</button>

### Python

    from google import genai
    from google.genai import types

    # Define the function declaration for the model
    schedule_meeting_function = {
        "name": "schedule_meeting",
        "description": "Schedules a meeting with specified attendees at a given time and date.",
        "parameters": {
            "type": "object",
            "properties": {
                "attendees": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of people attending the meeting.",
                },
                "date": {
                    "type": "string",
                    "description": "Date of the meeting (e.g., '2024-07-29')",
                },
                "time": {
                    "type": "string",
                    "description": "Time of the meeting (e.g., '15:00')",
                },
                "topic": {
                    "type": "string",
                    "description": "The subject or topic of the meeting.",
                },
            },
            "required": ["attendees", "date", "time", "topic"],
        },
    }

    # Configure the client and tools
    client = genai.Client()
    tools = types.Tool(function_declarations=[schedule_meeting_function])
    config = types.GenerateContentConfig(tools=[tools])

    # Send request with function declarations
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="Schedule a meeting with Bob and Alice for 03/14/2025 at 10:00 AM about the Q3 planning.",
        config=config,
    )

    # Check for a function call
    if response.candidates[0].content.parts[0].function_call:
        function_call = response.candidates[0].content.parts[0].function_call
        print(f"Function to call: {function_call.name}")
        print(f"ID: {function_call.id}")
        print(f"Arguments: {function_call.args}")
        #  In a real app, you would call your function here:
        #  result = schedule_meeting(**function_call.args)
    else:
        print("No function call found in the response.")
        print(response.text)

### JavaScript

    import { GoogleGenAI, Type } from '@google/genai';

    // Configure the client
    const ai = new GoogleGenAI({});

    // Define the function declaration for the model
    const scheduleMeetingFunctionDeclaration = {
      name: 'schedule_meeting',
      description: 'Schedules a meeting with specified attendees at a given time and date.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          attendees: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'List of people attending the meeting.',
          },
          date: {
            type: Type.STRING,
            description: 'Date of the meeting (e.g., "2024-07-29")',
          },
          time: {
            type: Type.STRING,
            description: 'Time of the meeting (e.g., "15:00")',
          },
          topic: {
            type: Type.STRING,
            description: 'The subject or topic of the meeting.',
          },
        },
        required: ['attendees', 'date', 'time', 'topic'],
      },
    };

    // Send request with function declarations
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Schedule a meeting with Bob and Alice for 03/27/2025 at 10:00 AM about the Q3 planning.',
      config: {
        tools: [{
          functionDeclarations: [scheduleMeetingFunctionDeclaration]
        }],
      },
    });

    // Check for function calls in the response
    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0]; // Assuming one function call
      console.log(`Function to call: ${functionCall.name}`);
      console.log(`ID: ${functionCall.id}`);
      console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
      // In a real app, you would call your actual function here:
      // const result = await scheduleMeeting(functionCall.args);
    } else {
      console.log("No function call found in the response.");
      console.log(response.text);
    }

### REST

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [
          {
            "role": "user",
            "parts": [
              {
                "text": "Schedule a meeting with Bob and Alice for 03/27/2025 at 10:00 AM about the Q3 planning."
              }
            ]
          }
        ],
        "tools": [
          {
            "functionDeclarations": [
              {
                "name": "schedule_meeting",
                "description": "Schedules a meeting with specified attendees at a given time and date.",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "attendees": {
                      "type": "array",
                      "items": {"type": "string"},
                      "description": "List of people attending the meeting."
                    },
                    "date": {
                      "type": "string",
                      "description": "Date of the meeting (e.g., '2024-07-29')"
                    },
                    "time": {
                      "type": "string",
                      "description": "Time of the meeting (e.g., '15:00')"
                    },
                    "topic": {
                      "type": "string",
                      "description": "The subject or topic of the meeting."
                    }
                  },
                  "required": ["attendees", "date", "time", "topic"]
                }
              }
            ]
          }
        ]
      }'

## How function calling works

![function calling
overview](https://ai.google.dev/static/gemini-api/docs/images/function-calling-overview.png)

Function calling involves a structured interaction between your application, the
model, and external functions. Here's a breakdown of the process:

1. **Define function declaration:** Define the function declaration in your application code. Function Declarations describe the function's name, parameters, and purpose to the model.
2. **Call API with function declarations:** Send user prompt along with the function declaration(s) to the model. It analyzes the request and determines if a function call would be helpful. If so, it responds with a structured JSON object containing the function name, arguments, and a unique `id` (this `id` is now always returned by the API for Gemini 3 models^\*^).
3. **Execute function code (your responsibility):** The Model *doesn't* execute the function itself. It's your application's responsibility to process the response and check for a function call. If
   - **Yes** : Extract the name, args, and `id` of the function and execute the corresponding function in your application.
   - **No:** The model has provided a direct text response to the prompt (this flow is less emphasized in the example but is a possible outcome).
4. **Create user friendly response:** If a function was executed, capture the result and send it back to the model, ensuring you include the matching `id`, in a subsequent turn of the conversation. It will use the result to generate a final, user-friendly response that incorporates the information from the function call.

This process can be repeated over multiple turns, allowing for complex
interactions and workflows. The model also supports calling multiple functions
in a single turn ([parallel function calling](https://ai.google.dev/gemini-api/docs/function-calling#parallel_function_calling)), in
sequence ([compositional function calling](https://ai.google.dev/gemini-api/docs/function-calling#compositional_function_calling)),
and with built-in Gemini tools ([multi-tool use](https://ai.google.dev/gemini-api/docs/function-calling#native-tools)).

^\*^ **Always map function IDs:** Gemini 3 now always returns a unique
`id` with every `functionCall`. Include this exact `id` in your
`functionResponse` so the model can accurately map your result back to the
original request.

### Step 1: Define a function declaration

Define a function and its declaration within your application code that allows
users to set light values and make an API request. This function could call
external services or APIs.

### Python

    # Define a function that the model can call to control smart lights
    set_light_values_declaration = {
        "name": "set_light_values",
        "description": "Sets the brightness and color temperature of a light.",
        "parameters": {
            "type": "object",
            "properties": {
                "brightness": {
                    "type": "integer",
                    "description": "Light level from 0 to 100. Zero is off and 100 is full brightness",
                },
                "color_temp": {
                    "type": "string",
                    "enum": ["daylight", "cool", "warm"],
                    "description": "Color temperature of the light fixture, which can be `daylight`, `cool` or `warm`.",
                },
            },
            "required": ["brightness", "color_temp"],
        },
    }

    # This is the actual function that would be called based on the model's suggestion
    def set_light_values(brightness: int, color_temp: str) -> dict[str, int | str]:
        """Set the brightness and color temperature of a room light. (mock API).

        Args:
            brightness: Light level from 0 to 100. Zero is off and 100 is full brightness
            color_temp: Color temperature of the light fixture, which can be `daylight`, `cool` or `warm`.

        Returns:
            A dictionary containing the set brightness and color temperature.
        """
        return {"brightness": brightness, "colorTemperature": color_temp}

### JavaScript

    import { Type } from '@google/genai';

    // Define a function that the model can call to control smart lights
    const setLightValuesFunctionDeclaration = {
      name: 'set_light_values',
      description: 'Sets the brightness and color temperature of a light.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          brightness: {
            type: Type.NUMBER,
            description: 'Light level from 0 to 100. Zero is off and 100 is full brightness',
          },
          color_temp: {
            type: Type.STRING,
            enum: ['daylight', 'cool', 'warm'],
            description: 'Color temperature of the light fixture, which can be `daylight`, `cool` or `warm`.',
          },
        },
        required: ['brightness', 'color_temp'],
      },
    };

    /**

    *   Set the brightness and color temperature of a room light. (mock API)
    *   @param {number} brightness - Light level from 0 to 100. Zero is off and 100 is full brightness
    *   @param {string} color_temp - Color temperature of the light fixture, which can be `daylight`, `cool` or `warm`.
    *   @return {Object} A dictionary containing the set brightness and color temperature.
    */
    function setLightValues(brightness, color_temp) {
      return {
        brightness: brightness,
        colorTemperature: color_temp
      };
    }

### Step 2: Call the model with function declarations

Once you have defined your function declarations, you can prompt the model to
use them. It analyzes the prompt and function declarations and decides whether
to respond directly or to call a function. If a function is called, the response
object will contain a function call suggestion.

### Python

    from google.genai import types

    # Configure the client and tools
    client = genai.Client()
    tools = types.Tool(function_declarations=[set_light_values_declaration])
    config = types.GenerateContentConfig(tools=[tools])

    # Define user prompt
    contents = [
        types.Content(
            role="user", parts=[types.Part(text="Turn the lights down to a romantic level")]
        )
    ]

    # Send request with function declarations
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=contents,
        config=config,
    )

    print(response.candidates[0].content.parts[0].function_call)

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    // Generation config with function declaration
    const config = {
      tools: [{
        functionDeclarations: [setLightValuesFunctionDeclaration]
      }]
    };

    // Configure the client
    const ai = new GoogleGenAI({});

    // Define user prompt
    const contents = [
      {
        role: 'user',
        parts: [{ text: 'Turn the lights down to a romantic level' }]
      }
    ];

    // Send request with function declarations
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: config
    });

    console.log(response.functionCalls[0]);

The model then returns a `functionCall` object in an OpenAPI compatible
schema specifying how to call one or more of the declared functions in order to
respond to the user's question.

### Python

    id='8f2b1a3c' args={'color_temp': 'warm', 'brightness': 25} name='set_light_values'

### JavaScript

    {
      id: '8f2b1a3c',
      name: 'set_light_values',
      args: { brightness: 25, color_temp: 'warm' }
    }

### Step 3: Execute set_light_values function code

Extract the function call details from the model's response, parse the arguments
, and execute the `set_light_values` function.

### Python

    # Extract tool call details, it may not be in the first part.
    tool_call = response.candidates[0].content.parts[0].function_call

    if tool_call.name == "set_light_values":
        result = set_light_values(**tool_call.args)
        print(f"Function execution result: {result}")

### JavaScript

    // Extract tool call details
    const tool_call = response.functionCalls[0]

    let result;
    if (tool_call.name === 'set_light_values') {
      result = setLightValues(tool_call.args.brightness, tool_call.args.color_temp);
      console.log(`Function execution result: ${JSON.stringify(result)}`);
    }

### Step 4: Create user friendly response with function result and call the model again

Finally, send the result of the function execution back to the model so it can
incorporate this information into its final response to the user.

### Python

    from google import genai
    from google.genai import types

    # Create a function response part
    function_response_part = types.Part.from_function_response(
        name=tool_call.name,
        response={"result": result},
        id=tool_call.id,
    )

    # Append function call and result of the function execution to contents
    contents.append(response.candidates[0].content) # Append the content from the model's response.
    contents.append(types.Content(role="user", parts=[function_response_part])) # Append the function response

    client = genai.Client()
    final_response = client.models.generate_content(
        model="gemini-3-flash-preview",
        config=config,
        contents=contents,
    )

    print(final_response.text)

### JavaScript

    // Create a function response part
    const function_response_part = {
      name: tool_call.name,
      response: { result },
      id: tool_call.id
    }

    // Append function call and result of the function execution to contents
    contents.push(response.candidates[0].content);
    contents.push({ role: 'user', parts: [{ functionResponse: function_response_part }] });

    // Get the final response from the model
    const final_response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: config
    });

    console.log(final_response.text);

This completes the function calling flow. The model successfully used the
`set_light_values` function to perform the request action of the user.

## Function declarations

When you implement function calling in a prompt, you create a `tools` object,
which contains one or more `function declarations`. You define functions using
JSON, specifically with a [select subset](https://ai.google.dev/api/caching#Schema)
of the [OpenAPI schema](https://spec.openapis.org/oas/v3.0.3#schemaw) format. A
single function declaration can include the following parameters:

- `name` (string): A unique name for the function (`get_weather_forecast`, `send_email`). Use descriptive names without spaces or special characters (use underscores or camelCase).
- `description` (string): A clear and detailed explanation of the function's purpose and capabilities. This is crucial for the model to understand when to use the function. Be specific and provide examples if helpful ("Finds theaters based on location and optionally movie title which is currently playing in theaters.").
- `parameters` (object): Defines the input parameters the function expects.
  - `type` (string): Specifies the overall data type, such as `object`.
  - `properties` (object): Lists individual parameters, each with:
    - `type` (string): The data type of the parameter, such as `string`, `integer`, `boolean, array`.
    - `description` (string): A description of the parameter's purpose and format. Provide examples and constraints ("The city and state, e.g., 'San Francisco, CA' or a zip code e.g., '95616'.").
    - `enum` (array, optional): If the parameter values are from a fixed set, use "enum" to list the allowed values instead of just describing them in the description. This improves accuracy ("enum": \["daylight", "cool", "warm"\]).
  - `required` (array): An array of strings listing the parameter names that are mandatory for the function to operate.

You can also construct `FunctionDeclarations` from Python functions directly using
`types.FunctionDeclaration.from_callable(client=client, callable=your_function)`.

## Function calling with thinking models

Gemini 3 and 2.5 series models use an internal ["thinking"](https://ai.google.dev/gemini-api/docs/thinking) process to reason through requests. This
significantly improves function calling performance,
allowing the model to better determine when to call a function and which
parameters to use. Because the Gemini API is stateless, models use
[thought signatures](https://ai.google.dev/gemini-api/docs/thought-signatures) to maintain context
across multi-turn conversations.

This section covers advanced management of thought signatures and is only
necessary if you're manually constructing API requests (e.g., via REST) or
manipulating conversation history.

**If you're using the [Google GenAI SDKs](https://ai.google.dev/gemini-api/docs/libraries) (our
official libraries), you don't need to manage this process** . The SDKs
automatically handle the necessary steps, as shown in the earlier
[example](https://ai.google.dev/gemini-api/docs/function-calling#step-4).

### Managing conversation history manually

If you modify the conversation history manually, instead of sending the
[complete previous response](https://ai.google.dev/gemini-api/docs/function-calling#step-4) you
must correctly handle the `thought_signature` included in the model's turn.

Follow these rules to ensure the model's context is preserved:

- Always send the `thought_signature` back to the model inside its original [`Part`](https://ai.google.dev/api#request-body-structure).
- **Always include the exact `id` from the `function_call` in your
  `function_response` so the API can map the result to the correct request.**
- Don't merge a `Part` containing a signature with one that does not. This breaks the positional context of the thought.
- Don't combine two `Parts` that both contain signatures, as the signature strings cannot be merged.

#### Gemini 3 thought signatures

In Gemini 3, any [`Part`](https://ai.google.dev/api#request-body-structure) of a model response
may contain a thought signature.
While we generally recommend returning signatures from all `Part` types,
passing back thought signatures is mandatory for function calling. Unless you
are manipulating conversation history manually, the Google GenAI SDK will
handle thought signatures automatically.

If you are manipulating conversation history manually, refer to the
[Thoughts Signatures](https://ai.google.dev/gemini-api/docs/thought-signatures) page for complete
guidance and details on handling thought signatures for Gemini 3.

##### Inspecting thought signatures

While not necessary for implementation, you can inspect the response to see the
`thought_signature` for debugging or educational purposes.

### Python

    import base64
    # After receiving a response from a model with thinking enabled
    # response = client.models.generate_content(...)

    # The signature is attached to the response part containing the function call
    part = response.candidates[0].content.parts[0]
    if part.thought_signature:
      print(base64.b64encode(part.thought_signature).decode("utf-8"))

### JavaScript

    // After receiving a response from a model with thinking enabled
    // const response = await ai.models.generateContent(...)

    // The signature is attached to the response part containing the function call
    const part = response.candidates[0].content.parts[0];
    if (part.thoughtSignature) {
      console.log(part.thoughtSignature);
    }

Learn more about limitations and usage of thought signatures, and about thinking
models in general, on the [Thinking](https://ai.google.dev/gemini-api/docs/thinking#signatures) page.

## Parallel function calling

In addition to single turn function calling, you can also call multiple
functions at once. Parallel function calling lets you execute multiple functions
at once and is used when the functions are not dependent on each other. This is
useful in scenarios like gathering data from multiple independent sources, such
as retrieving customer details from different databases or checking inventory
levels across various warehouses or performing multiple actions such as
converting your apartment into a disco.

When the model initiates multiple function calls in a single turn, you don't
need to return the `function_result` objects in the same order that the
`function_call` objects were received. The Gemini API maps each result back to
its corresponding call using the `id` from the model's output. This lets you
execute your functions asynchronously and append the results to your list as
they complete.

### Python

    power_disco_ball = {
        "name": "power_disco_ball",
        "description": "Powers the spinning disco ball.",
        "parameters": {
            "type": "object",
            "properties": {
                "power": {
                    "type": "boolean",
                    "description": "Whether to turn the disco ball on or off.",
                }
            },
            "required": ["power"],
        },
    }

    start_music = {
        "name": "start_music",
        "description": "Play some music matching the specified parameters.",
        "parameters": {
            "type": "object",
            "properties": {
                "energetic": {
                    "type": "boolean",
                    "description": "Whether the music is energetic or not.",
                },
                "loud": {
                    "type": "boolean",
                    "description": "Whether the music is loud or not.",
                },
            },
            "required": ["energetic", "loud"],
        },
    }

    dim_lights = {
        "name": "dim_lights",
        "description": "Dim the lights.",
        "parameters": {
            "type": "object",
            "properties": {
                "brightness": {
                    "type": "number",
                    "description": "The brightness of the lights, 0.0 is off, 1.0 is full.",
                }
            },
            "required": ["brightness"],
        },
    }

### JavaScript

    import { Type } from '@google/genai';

    const powerDiscoBall = {
      name: 'power_disco_ball',
      description: 'Powers the spinning disco ball.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          power: {
            type: Type.BOOLEAN,
            description: 'Whether to turn the disco ball on or off.'
          }
        },
        required: ['power']
      }
    };

    const startMusic = {
      name: 'start_music',
      description: 'Play some music matching the specified parameters.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          energetic: {
            type: Type.BOOLEAN,
            description: 'Whether the music is energetic or not.'
          },
          loud: {
            type: Type.BOOLEAN,
            description: 'Whether the music is loud or not.'
          }
        },
        required: ['energetic', 'loud']
      }
    };

    const dimLights = {
      name: 'dim_lights',
      description: 'Dim the lights.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          brightness: {
            type: Type.NUMBER,
            description: 'The brightness of the lights, 0.0 is off, 1.0 is full.'
          }
        },
        required: ['brightness']
      }
    };

Configure the function calling mode to allow using all of the specified tools.
To learn more, you can read about
[configuring function calling](https://ai.google.dev/gemini-api/docs/function-calling#function_calling_modes).

### Python

    from google import genai
    from google.genai import types

    # Configure the client and tools
    client = genai.Client()
    house_tools = [
        types.Tool(function_declarations=[power_disco_ball, start_music, dim_lights])
    ]
    config = types.GenerateContentConfig(
        tools=house_tools,
        automatic_function_calling=types.AutomaticFunctionCallingConfig(
            disable=True
        ),
        # Force the model to call 'any' function, instead of chatting.
        tool_config=types.ToolConfig(
            function_calling_config=types.FunctionCallingConfig(mode='ANY')
        ),
    )

    chat = client.chats.create(model="gemini-3-flash-preview", config=config)
    response = chat.send_message("Turn this place into a party!")

    # Print out each of the function calls requested from this single call
    print("Example 1: Forced function calling")
    for fn in response.function_calls:
        args = ", ".join(f"{key}={val}" for key, val in fn.args.items())
        print(f"{fn.name}({args}) - ID: {fn.id}")

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    // Set up function declarations
    const houseFns = [powerDiscoBall, startMusic, dimLights];

    const config = {
        tools: [{
            functionDeclarations: houseFns
        }],
        // Force the model to call 'any' function, instead of chatting.
        toolConfig: {
            functionCallingConfig: {
                mode: 'any'
            }
        }
    };

    // Configure the client
    const ai = new GoogleGenAI({});

    // Create a chat session
    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: config
    });
    const response = await chat.sendMessage({message: 'Turn this place into a party!'});

    // Print out each of the function calls requested from this single call
    console.log("Example 1: Forced function calling");
    for (const fn of response.functionCalls) {
        const args = Object.entries(fn.args)
            .map(([key, val]) => `${key}=${val}`)
            .join(', ');
        console.log(`${fn.name}(${args}) - ID: ${fn.id}`);
    }

Each of the printed results reflects a single function call that the model has
requested. To send the results back, include the responses in the same order as
they were requested.

The Python SDK supports [automatic function calling](https://ai.google.dev/gemini-api/docs/function-calling#automatic_function_calling_python_only),
which automatically converts Python functions to declarations, handles the
function call execution and response cycle for you. Following is an example for
the disco use case.

> [!NOTE]
> **Note:** Automatic Function Calling is a Python SDK only feature at the moment.

### Python

    from google import genai
    from google.genai import types

    # Actual function implementations
    def power_disco_ball_impl(power: bool) -> dict:
        """Powers the spinning disco ball.

        Args:
            power: Whether to turn the disco ball on or off.

        Returns:
            A status dictionary indicating the current state.
        """
        return {"status": f"Disco ball powered {'on' if power else 'off'}"}

    def start_music_impl(energetic: bool, loud: bool) -> dict:
        """Play some music matching the specified parameters.

        Args:
            energetic: Whether the music is energetic or not.
            loud: Whether the music is loud or not.

        Returns:
            A dictionary containing the music settings.
        """
        music_type = "energetic" if energetic else "chill"
        volume = "loud" if loud else "quiet"
        return {"music_type": music_type, "volume": volume}

    def dim_lights_impl(brightness: float) -> dict:
        """Dim the lights.

        Args:
            brightness: The brightness of the lights, 0.0 is off, 1.0 is full.

        Returns:
            A dictionary containing the new brightness setting.
        """
        return {"brightness": brightness}

    # Configure the client
    client = genai.Client()
    config = types.GenerateContentConfig(
        tools=[power_disco_ball_impl, start_music_impl, dim_lights_impl]
    )

    # Make the request
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="Do everything you need to this place into party!",
        config=config,
    )

    print("\nExample 2: Automatic function calling")
    print(response.text)
    # I've turned on the disco ball, started playing loud and energetic music, and dimmed the lights to 50% brightness. Let's get this party started!

## Compositional function calling

Compositional or sequential function calling allows Gemini to chain multiple
function calls together to fulfill a complex request. For example, to answer
"Get the temperature in my current location", the Gemini API might first invoke
a `get_current_location()` function followed by a `get_weather()` function that
takes the location as a parameter.

The following example demonstrates how to implement compositional function
calling using the Python SDK and automatic function calling.

### Python

This example uses the automatic function calling feature of the
`google-genai` Python SDK. The SDK automatically converts the Python
functions to the required schema, executes the function calls when requested
by the model, and sends the results back to the model to complete the task.

    import os
    from google import genai
    from google.genai import types

    # Example Functions
    def get_weather_forecast(location: str) -> dict:
        """Gets the current weather temperature for a given location."""
        print(f"Tool Call: get_weather_forecast(location={location})")
        # TODO: Make API call
        print("Tool Response: {'temperature': 25, 'unit': 'celsius'}")
        return {"temperature": 25, "unit": "celsius"}  # Dummy response

    def set_thermostat_temperature(temperature: int) -> dict:
        """Sets the thermostat to a desired temperature."""
        print(f"Tool Call: set_thermostat_temperature(temperature={temperature})")
        # TODO: Interact with a thermostat API
        print("Tool Response: {'status': 'success'}")
        return {"status": "success"}

    # Configure the client and model
    client = genai.Client()
    config = types.GenerateContentConfig(
        tools=[get_weather_forecast, set_thermostat_temperature]
    )

    # Make the request
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="If it's warmer than 20°C in London, set the thermostat to 20°C, otherwise set it to 18°C.",
        config=config,
    )

    # Print the final, user-facing response
    print(response.text)

**Expected Output**

When you run the code, you will see the SDK orchestrating the function
calls. The model first calls `get_weather_forecast`, receives the
temperature, and then calls `set_thermostat_temperature` with the correct
value based on the logic in the prompt.

    Tool Call: get_weather_forecast(location=London)
    Tool Response: {'temperature': 25, 'unit': 'celsius'}
    Tool Call: set_thermostat_temperature(temperature=20)
    Tool Response: {'status': 'success'}
    OK. I've set the thermostat to 20°C.

### JavaScript

This example shows how to use JavaScript/TypeScript SDK to do comopositional
function calling using a manual execution loop.

    import { GoogleGenAI, Type } from "@google/genai";

    // Configure the client
    const ai = new GoogleGenAI({});

    // Example Functions
    function get_weather_forecast({ location }) {
      console.log(`Tool Call: get_weather_forecast(location=${location})`);
      // TODO: Make API call
      console.log("Tool Response: {'temperature': 25, 'unit': 'celsius'}");
      return { temperature: 25, unit: "celsius" };
    }

    function set_thermostat_temperature({ temperature }) {
      console.log(
        `Tool Call: set_thermostat_temperature(temperature=${temperature})`,
      );
      // TODO: Make API call
      console.log("Tool Response: {'status': 'success'}");
      return { status: "success" };
    }

    const toolFunctions = {
      get_weather_forecast,
      set_thermostat_temperature,
    };

    const tools = [
      {
        functionDeclarations: [
          {
            name: "get_weather_forecast",
            description:
              "Gets the current weather temperature for a given location.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                location: {
                  type: Type.STRING,
                },
              },
              required: ["location"],
            },
          },
          {
            name: "set_thermostat_temperature",
            description: "Sets the thermostat to a desired temperature.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                temperature: {
                  type: Type.NUMBER,
                },
              },
              required: ["temperature"],
            },
          },
        ],
      },
    ];

    // Prompt for the model
    let contents = [
      {
        role: "user",
        parts: [
          {
            text: "If it's warmer than 20°C in London, set the thermostat to 20°C, otherwise set it to 18°C.",
          },
        ],
      },
    ];

    // Loop until the model has no more function calls to make
    while (true) {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: { tools },
      });

      if (result.functionCalls && result.functionCalls.length > 0) {
        const functionCall = result.functionCalls[0];

        const { name, args } = functionCall;

        if (!toolFunctions[name]) {
          throw new Error(`Unknown function call: ${name}`);
        }

        // Call the function and get the response.
        const toolResponse = toolFunctions[name](args);

        const functionResponsePart = {
          name: functionCall.name,
          response: {
            result: toolResponse,
          },
          id: functionCall.id,
        };

        // Send the function response back to the model.
        contents.push({
          role: "model",
          parts: [
            {
              functionCall: functionCall,
            },
          ],
        });
        contents.push({
          role: "user",
          parts: [
            {
              functionResponse: functionResponsePart,
            },
          ],
        });
      } else {
        // No more function calls, break the loop.
        console.log(result.text);
        break;
      }
    }

**Expected Output**

When you run the code, you will see the SDK orchestrating the function
calls. The model first calls `get_weather_forecast`, receives the
temperature, and then calls `set_thermostat_temperature` with the correct
value based on the logic in the prompt.

    Tool Call: get_weather_forecast(location=London)
    Tool Response: {'temperature': 25, 'unit': 'celsius'}
    Tool Call: set_thermostat_temperature(temperature=20)
    Tool Response: {'status': 'success'}
    OK. It's 25°C in London, so I've set the thermostat to 20°C.

Compositional function calling is a native [Live
API](https://ai.google.dev/gemini-api/docs/live) feature. This means Live API
can handle the function calling similar to the Python SDK.

### Python

    # Light control schemas
    turn_on_the_lights_schema = {'name': 'turn_on_the_lights'}
    turn_off_the_lights_schema = {'name': 'turn_off_the_lights'}

    prompt = """
      Hey, can you write run some python code to turn on the lights, wait 10s and then turn off the lights?
      """

    tools = [
        {'code_execution': {}},
        {'function_declarations': [turn_on_the_lights_schema, turn_off_the_lights_schema]}
    ]

    await run(prompt, tools=tools, modality="AUDIO")

### JavaScript

    // Light control schemas
    const turnOnTheLightsSchema = { name: 'turn_on_the_lights' };
    const turnOffTheLightsSchema = { name: 'turn_off_the_lights' };

    const prompt = `
      Hey, can you write run some python code to turn on the lights, wait 10s and then turn off the lights?
    `;

    const tools = [
      { codeExecution: {} },
      { functionDeclarations: [turnOnTheLightsSchema, turnOffTheLightsSchema] }
    ];

    await run(prompt, tools=tools, modality="AUDIO")

## Function calling modes

The Gemini API lets you control how the model uses the provided tools
(function declarations). Specifically, you can set the mode within
the.`function_calling_config`.

- `VALIDATED`: Default mode for tool combination (when built-in tools or structured outputs also enabled). The model is constrained to predict either function calls or natural language, and ensures function schema adherence. If `allowed_function_names` is not provided, the model picks from all of the available function declarations. If `allowed_function_names` is provided, the model picks from the set of allowed functions. This mode reduces malformed function calls (compared to `AUTO` mode).
- `AUTO`: Default mode when only function_declarations tool enabled. The model decides whether to generate a natural language response or suggest a function call based on the prompt and context.
- `ANY`: The model is constrained to always predict a function call and ensures function schema adherence. If `allowed_function_names` is not specified, the model can choose from any of the provided function declarations. If `allowed_function_names` is provided as a list, the model can only choose from the functions in that list. Use this mode when you require a function call response to every prompt (if applicable).
- `NONE`: The model is *prohibited* from making function calls. This is
  equivalent to sending a request without any function declarations. Use this to
  temporarily disable function calling without removing your tool definitions.

### Python

    from google.genai import types

    # Configure function calling mode
    tool_config = types.ToolConfig(
        function_calling_config=types.FunctionCallingConfig(
            mode="ANY", allowed_function_names=["get_current_temperature"]
        )
    )

    # Create the generation config
    config = types.GenerateContentConfig(
        tools=[tools],  # not defined here.
        tool_config=tool_config,
    )

### JavaScript

    import { FunctionCallingConfigMode } from '@google/genai';

    // Configure function calling mode
    const toolConfig = {
      functionCallingConfig: {
        mode: FunctionCallingConfigMode.ANY,
        allowedFunctionNames: ['get_current_temperature']
      }
    };

    // Create the generation config
    const config = {
      tools: tools, // not defined here.
      toolConfig: toolConfig,
    };

## Automatic function calling (Python only)

When using the Python SDK, you can provide Python functions directly as tools.
The SDK converts these functions into declarations, manages the function call
execution, and handles the response cycle for you. Define your function with
type hints and a docstring. For optimal results, it is recommended to use
[Google-style docstrings.](https://google.github.io/styleguide/pyguide.html#383-functions-and-methods)
The SDK will then automatically:

1. Detect function call responses from the model.
2. Call the corresponding Python function in your code.
3. Send the function's response back to the model.
4. Return the model's final text response.

The SDK currently doesn't parse argument descriptions into the property
description slots of the generated function declaration. Instead, it sends the
entire docstring as the top-level function description.

### Python

    from google import genai
    from google.genai import types

    # Define the function with type hints and docstring
    def get_current_temperature(location: str) -> dict:
        """Gets the current temperature for a given location.

        Args:
            location: The city and state, e.g. San Francisco, CA

        Returns:
            A dictionary containing the temperature and unit.
        """
        # ... (implementation) ...
        return {"temperature": 25, "unit": "Celsius"}

    # Configure the client
    client = genai.Client()
    config = types.GenerateContentConfig(
        tools=[get_current_temperature]
    )  # Pass the function itself

    # Make the request
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="What's the temperature in Boston?",
        config=config,
    )

    print(response.text)  # The SDK handles the function call and returns the final text

You can disable automatic function calling with:

### Python

    config = types.GenerateContentConfig(
        tools=[get_current_temperature],
        automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True)
    )

### Automatic function schema declaration

The API is able to describe any of the following types. `Pydantic` types are
allowed, as long as the fields defined on them are also composed of allowed
types. Dict types (like `dict[str: int]`) are not well supported here, don't
use them.

### Python

    AllowedType = (
      int | float | bool | str | list['AllowedType'] | pydantic.BaseModel)

To see what the inferred schema looks like, you can convert it using
[`from_callable`](https://googleapis.github.io/python-genai/genai.html#genai.types.FunctionDeclaration.from_callable):

### Python

    from google import genai
    from google.genai import types

    def multiply(a: float, b: float):
        """Returns a * b."""
        return a * b

    client = genai.Client()
    fn_decl = types.FunctionDeclaration.from_callable(callable=multiply, client=client)

    # to_json_dict() provides a clean JSON representation.
    print(fn_decl.to_json_dict())

## Multi-tool use: Combine built-in tools with function calling

You can enable multiple tools, combining built-in tools with function calling in
the same request.

Gemini 3 models can combine built-in tools with function calling out-of-the-box,
thanks to the tool context circulation feature. Read the page on
[Combining built-in tools and function calling](https://ai.google.dev/gemini-api/docs/tool-combination) to learn more.

> [!WARNING]
> **Preview:** Combining built-in tools with function calling and tool context circulation features are in Preview in Gemini 3 models.

### Python

    from google import genai
    from google.genai import types

    client = genai.Client()

    getWeather = {
        "name": "getWeather",
        "description": "Gets the weather for a requested city.",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "The city and state, e.g. Utqiaġvik, Alaska",
                },
            },
            "required": ["city"],
        },
    }

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="What is the northernmost city in the United States? What's the weather like there today?",
        config=types.GenerateContentConfig(
          tools=[
            types.Tool(
              google_search=types.ToolGoogleSearch(),  # Built-in tool
              function_declarations=[getWeather]       # Custom tool
            ),
          ],
          include_server_side_tool_invocations=True
        ),
    )

    history = [
        types.Content(
            role="user",
            parts=[types.Part(text="What is the northernmost city in the United States? What's the weather like there today?")]
        ),
        response.candidates[0].content,
        types.Content(
            role="user",
            parts=[types.Part(
                function_response=types.FunctionResponse(
                    name="getWeather",
                    response={"response": "Very cold. 22 degrees Fahrenheit."},
                    id=response.candidates[0].content.parts[2].function_call.id
                )
            )]
        )
    ]

    response_2 = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=history,
        config=types.GenerateContentConfig(
          tools=[
            types.Tool(
              google_search=types.ToolGoogleSearch(),
              function_declarations=[getWeather]
            ),
          ],
          include_server_side_tool_invocations=True
        ),
    )

### Javascript

    import { GoogleGenAI, Type } from '@google/genai';

    const client = new GoogleGenAI({});

    const getWeather = {
        name: "getWeather",
        description: "Get the weather in a given location",
        parameters: {
            type: "OBJECT",
            properties: {
                location: {
                    type: "STRING",
                    description: "The city and state, e.g. San Francisco, CA"
                }
            },
            required: ["location"]
        }
    };

    async function run() {
        const model = client.models.generateContent({
            model: "gemini-3-flash-preview",
        });

        const tools = [
          { googleSearch: {} },
          { functionDeclarations: [getWeather] }
        ];
        const toolConfig = { includeServerSideToolInvocations: true };

        const result1 = await model.generateContent({
            contents: [{role: "user", parts: [{text: "What is the northernmost city in the United States? What's the weather like there today?"}]}],
            tools: tools,
            toolConfig: toolConfig,
        });

        const response1 = result1.response;
        const functionCallId = response1.candidates[0].content.parts.find(p => p.functionCall)?.functionCall?.id;

        const history = [
            {
                role: "user",
                parts:[{text: "What is the northernmost city in the United States? What's the weather like there today?"}]
            },
            response1.candidates[0].content,
            {
                role: "user",
                parts: [{
                    functionResponse: {
                        name: "getWeather",
                        response: {response: "Very cold. 22 degrees Fahrenheit."},
                        id: functionCallId
                    }
                }]
            }
        ];

        const result2 = await model.generateContent({
            contents: history,
            tools: tools,
            toolConfig: toolConfig,
        });
    }

    run();

For models before the Gemini 3 series, use the
[Live API](https://ai.google.dev/gemini-api/docs/live-api/tools).

## Multimodal function responses

> [!NOTE]
> **Note:** This feature is available for [Gemini 3](https://ai.google.dev/gemini-api/docs/gemini-3) series models.

For Gemini 3 series models, you can include multimodal content in
the function response parts that you send to the model. The model can process
this multimodal content in its next turn to produce a more informed response.
The following MIME types are supported for multimodal content in function
responses:

- **Images** : `image/png`, `image/jpeg`, `image/webp`
- **Documents** : `application/pdf`, `text/plain`

To include multimodal data in a function response, include it as one or more
parts nested within the `functionResponse` part. Each multimodal part must
contain `inlineData`. If you reference a multimodal part from
within the structured `response` field, it must contain a unique `displayName`.

You can also reference a multimodal part from within the structured `response`
field of the `functionResponse` part by using the JSON reference format
`{"$ref": "<displayName>"}`. The model substitutes the reference with the
multimodal content when processing the response. Each `displayName` can only be
referenced once in the structured `response` field.

The following example shows a message containing a `functionResponse` for a
function named `get_image` and a nested part containing image data with
`displayName: "instrument.jpg"`. The `functionResponse`'s `response` field
references this image part:

### Python

    from google import genai
    from google.genai import types

    import requests

    client = genai.Client()

    # This is a manual, two turn multimodal function calling workflow:

    # 1. Define the function tool
    get_image_declaration = types.FunctionDeclaration(
      name="get_image",
      description="Retrieves the image file reference for a specific order item.",
      parameters={
          "type": "object",
          "properties": {
              "item_name": {
                  "type": "string",
                  "description": "The name or description of the item ordered (e.g., 'instrument')."
              }
          },
          "required": ["item_name"],
      },
    )
    tool_config = types.Tool(function_declarations=[get_image_declaration])

    # 2. Send a message that triggers the tool
    prompt = "Show me the instrument I ordered last month."
    response_1 = client.models.generate_content(
      model="gemini-3-flash-preview",
      contents=[prompt],
      config=types.GenerateContentConfig(
          tools=[tool_config],
      )
    )

    # 3. Handle the function call
    function_call = response_1.function_calls[0]
    requested_item = function_call.args["item_name"]
    print(f"Model wants to call: {function_call.name}")

    # Execute your tool (e.g., call an API)
    # (This is a mock response for the example)
    print(f"Calling external tool for: {requested_item}")

    function_response_data = {
      "image_ref": {"$ref": "instrument.jpg"},
    }
    image_path = "https://goo.gle/instrument-img"
    image_bytes = requests.get(image_path).content
    function_response_multimodal_data = types.FunctionResponsePart(
      inline_data=types.FunctionResponseBlob(
        mime_type="image/jpeg",
        display_name="instrument.jpg",
        data=image_bytes,
      )
    )

    # 4. Send the tool's result back
    # Append this turn's messages to history for a final response.
    history = [
      types.Content(role="user", parts=[types.Part(text=prompt)]),
      response_1.candidates[0].content,
      types.Content(
        role="user",
        parts=[
            types.Part.from_function_response(
              id=function_call.id,
              name=function_call.name,
              response=function_response_data,
              parts=[function_response_multimodal_data]
            )
        ],
      )
    ]

    response_2 = client.models.generate_content(
      model="gemini-3-flash-preview",
      contents=history,
      config=types.GenerateContentConfig(
          tools=[tool_config],
          thinking_config=types.ThinkingConfig(include_thoughts=True)
      ),
    )

    print(f"\nFinal model response: {response_2.text}")

### JavaScript

    import { GoogleGenAI, Type } from '@google/genai';

    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // This is a manual, two turn multimodal function calling workflow:
    // 1. Define the function tool
    const getImageDeclaration = {
      name: 'get_image',
      description: 'Retrieves the image file reference for a specific order item.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          item_name: {
            type: Type.STRING,
            description: "The name or description of the item ordered (e.g., 'instrument').",
          },
        },
        required: ['item_name'],
      },
    };

    const toolConfig = {
      functionDeclarations: [getImageDeclaration],
    };

    // 2. Send a message that triggers the tool
    const prompt = 'Show me the instrument I ordered last month.';
    const response1 = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [toolConfig],
      },
    });

    // 3. Handle the function call
    const functionCall = response1.functionCalls[0];
    const requestedItem = functionCall.args.item_name;
    console.log(`Model wants to call: ${functionCall.name}`);

    // Execute your tool (e.g., call an API)
    // (This is a mock response for the example)
    console.log(`Calling external tool for: ${requestedItem}`);

    const functionResponseData = {
      image_ref: { $ref: 'instrument.jpg' },
    };

    const imageUrl = "https://goo.gle/instrument-img";
    const response = await fetch(imageUrl);
    const imageArrayBuffer = await response.arrayBuffer();
    const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

    const functionResponseMultimodalData = {
      inlineData: {
        mimeType: 'image/jpeg',
        displayName: 'instrument.jpg',
        data: base64ImageData,
      },
    };

    // 4. Send the tool's result back
    // Append this turn's messages to history for a final response.
    const history = [
      { role: 'user', parts: [{ text: prompt }] },
      response1.candidates[0].content,
      {
        role: 'user',
        parts: [
          {
            functionResponse: {
              id: functionCall.id,
              name: functionCall.name,
              response: functionResponseData,
              parts: [functionResponseMultimodalData]
            },
          },
        ],
      },
    ];

    const response2 = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        tools: [toolConfig],
        thinkingConfig: { includeThoughts: true },
      },
    });

    console.log(`\nFinal model response: ${response2.text}`);

### REST

    IMG_URL="https://goo.gle/instrument-img"

    MIME_TYPE=$(curl -sIL "$IMG_URL" | grep -i '^content-type:' | awk -F ': ' '{print $2}' | sed 's/\r$//' | head -n 1)
    if [[ -z "$MIME_TYPE" || ! "$MIME_TYPE" == image/* ]]; then
      MIME_TYPE="image/jpeg"
    fi

    # Check for macOS
    if [[ "$(uname)" == "Darwin" ]]; then
      IMAGE_B64=$(curl -sL "$IMG_URL" | base64 -b 0)
    elif [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      IMAGE_B64=$(curl -sL "$IMG_URL" | base64)
    else
      IMAGE_B64=$(curl -sL "$IMG_URL" | base64 -w0)
    fi

    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -X POST \
      -d '{
        "contents": [
          ...,
          {
            "role": "user",
            "parts": [
            {
                "functionResponse": {
                  "name": "get_image",
                  "id": "UNIQUE_CALL_ID_HERE",
                  "response": {
                    "image_ref": {
                      "$ref": "instrument.jpg"
                    }
                  },
                  "parts": [
                    {
                      "inlineData": {
                        "displayName": "instrument.jpg",
                        "mimeType":"'"$MIME_TYPE"'",
                        "data": "'"$IMAGE_B64"'"
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }'

## Function calling with Structured output

> [!NOTE]
> **Note:** This feature is available for [Gemini 3](https://ai.google.dev/gemini-api/docs/gemini-3) series models.

For Gemini 3 series models, you can use function calling with
[structured output](https://ai.google.dev/gemini-api/docs/structured-output). This lets the model
predict function calls or outputs that adhere to a specific schema. As a result,
you receive consistently formatted responses when the model doesn't generate
function calls.

## Model context protocol (MCP)

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) is
an open standard for connecting AI applications with external tools and data.
MCP provides a common protocol for models to access context, such as functions
(tools), data sources (resources), or predefined prompts.

The Gemini SDKs have built-in support for the MCP, reducing boilerplate code and
offering
[automatic tool calling](https://ai.google.dev/gemini-api/docs/function-calling#automatic_function_calling_python_only)
for MCP tools. When the model generates an MCP tool call, the Python and
JavaScript client SDK can automatically execute the MCP tool and send the
response back to the model in a subsequent request, continuing this loop until
no more tool calls are made by the model.

Here, you can find an example of how to use a local MCP server with Gemini and
`mcp` SDK.

### Python

Make sure the latest version of the
[`mcp` SDK](https://modelcontextprotocol.io/introduction) is installed on
your platform of choice.

    pip install mcp

> [!NOTE]
> **Note:** Python supports automatic tool calling by passing in the `ClientSession` into the `tools` parameters. If you want to disable it, you can provide `automatic_function_calling` with disabled `True`.

    import os
    import asyncio
    from datetime import datetime
    from mcp import ClientSession, StdioServerParameters
    from mcp.client.stdio import stdio_client
    from google import genai

    client = genai.Client()

    # Create server parameters for stdio connection
    server_params = StdioServerParameters(
        command="npx",  # Executable
        args=["-y", "@philschmid/weather-mcp"],  # MCP Server
        env=None,  # Optional environment variables
    )

    async def run():
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                # Prompt to get the weather for the current day in London.
                prompt = f"What is the weather in London in {datetime.now().strftime('%Y-%m-%d')}?"

                # Initialize the connection between client and server
                await session.initialize()

                # Send request to the model with MCP function declarations
                response = await client.aio.models.generate_content(
                    model="gemini-3-flash-preview",
                    contents=prompt,
                    config=genai.types.GenerateContentConfig(
                        temperature=0,
                        tools=[session],  # uses the session, will automatically call the tool
                        # Uncomment if you **don't** want the SDK to automatically call the tool
                        # automatic_function_calling=genai.types.AutomaticFunctionCallingConfig(
                        #     disable=True
                        # ),
                    ),
                )
                print(response.text)

    # Start the asyncio event loop and run the main function
    asyncio.run(run())

### JavaScript

Make sure the latest version of the `mcp` SDK is installed on your platform
of choice.

    npm install @modelcontextprotocol/sdk

> [!NOTE]
> **Note:** JavaScript supports automatic tool calling by wrapping the `client` with `mcpToTool`. If you want to disable it, you can provide `automaticFunctionCalling` with disabled `true`.

    import { GoogleGenAI, FunctionCallingConfigMode , mcpToTool} from '@google/genai';
    import { Client } from "@modelcontextprotocol/sdk/client/index.js";
    import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

    // Create server parameters for stdio connection
    const serverParams = new StdioClientTransport({
      command: "npx", // Executable
      args: ["-y", "@philschmid/weather-mcp"] // MCP Server
    });

    const client = new Client(
      {
        name: "example-client",
        version: "1.0.0"
      }
    );

    // Configure the client
    const ai = new GoogleGenAI({});

    // Initialize the connection between client and server
    await client.connect(serverParams);

    // Send request to the model with MCP tools
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `What is the weather in London in ${new Date().toLocaleDateString()}?`,
      config: {
        tools: [mcpToTool(client)],  // uses the session, will automatically call the tool
        // Uncomment if you **don't** want the sdk to automatically call the tool
        // automaticFunctionCalling: {
        //   disable: true,
        // },
      },
    });
    console.log(response.text)

    // Close the connection
    await client.close();

### Limitations with built-in MCP support

Built-in MCP support is a [experimental](https://ai.google.dev/gemini-api/docs/models#preview)
feature in our SDKs and has the following limitations:

- Only tools are supported, not resources nor prompts
- It is available for the Python and JavaScript/TypeScript SDK.
- Breaking changes might occur in future releases.

Manual integration of MCP servers is always an option if these limit what you're
building.

## Supported models

This section lists models and their function calling capabilities. Experimental
models are not included. You can find a comprehensive capabilities overview on
the [model overview](https://ai.google.dev/gemini-api/docs/models) page.

| Model | Function calling | Parallel function calling | Compositional function calling |
|---|---|---|---|
| [Gemini 3.1 Pro Preview](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview) | ✔️ | ✔️ | ✔️ |
| [Gemini 3.1 Flash-Lite](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite) | ✔️ | ✔️ | ✔️ |
| [Gemini 3.1 Flash-Lite Preview](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite-preview) | ✔️ | ✔️ | ✔️ |
| [Gemini 3 Flash Preview](https://ai.google.dev/gemini-api/docs/models/gemini-3-flash-preview) | ✔️ | ✔️ | ✔️ |
| [Gemini 2.5 Pro](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-pro) | ✔️ | ✔️ | ✔️ |
| [Gemini 2.5 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash) | ✔️ | ✔️ | ✔️ |
| [Gemini 2.5 Flash-Lite](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-lite) | ✔️ | ✔️ | ✔️ |
| [Gemini 2.0 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-2.0-flash) | ✔️ | ✔️ | ✔️ |

## Best practices

- **Function and Parameter Descriptions:** Be extremely clear and specific in your descriptions. The model relies on these to choose the correct function and provide appropriate arguments.
- **Naming:** Use descriptive function names (without spaces, periods, or dashes).
- **Strong Typing:** Use specific types (integer, string, enum) for parameters to reduce errors. If a parameter has a limited set of valid values, use an enum.
- **Tool Selection:** While the model can use an arbitrary number of tools, providing too many can increase the risk of selecting an incorrect or suboptimal tool. For best results, aim to provide only the relevant tools for the context or task, ideally keeping the active set to a maximum of 10-20. Consider dynamic tool selection based on conversation context if you have a large total number of tools.
- **Prompt Engineering:**
  - Provide context: Tell the model its role (e.g., "You are a helpful weather assistant.").
  - Give instructions: Specify how and when to use functions (e.g., "Don't guess dates; always use a future date for forecasts.").
  - Encourage clarification: Instruct the model to ask clarifying questions if needed.
  - See [Agentic workflows](https://ai.google.dev/gemini-api/docs/prompting-strategies#agentic-workflows) for further strategies on designing these prompts. Here is an example of a tested [system instruction](https://ai.google.dev/gemini-api/docs/prompting-strategies#agentic-si-template).
- **Temperature:** Use a low temperature (e.g., 0) for more deterministic and
  reliable function calls.

  > [!NOTE]
  > When using Gemini 3 models, we strongly recommend keeping the `temperature` at its default value of 1.0. Changing the temperature (setting it below 1.0) may lead to unexpected behavior, such as looping or degraded performance, particularly in complex mathematical or reasoning tasks.

- **Validation:** If a function call has significant consequences (e.g.,
  placing an order), validate the call with the user before executing it.

- **Check Finish Reason:** Always check the [`finishReason`](https://ai.google.dev/api/generate-content#FinishReason)
  in the model's response to handle cases where the model failed to generate a
  valid function call.

- **Error Handling**: Implement robust error handling in your functions to
  gracefully handle unexpected inputs or API failures. Return informative
  error messages that the model can use to generate helpful responses to the
  user.

- **Security:** Be mindful of security when calling external APIs. Use
  appropriate authentication and authorization mechanisms. Avoid exposing
  sensitive data in function calls.

- **Token Limits:** Function descriptions and parameters count towards your
  input token limit. If you're hitting token limits, consider limiting the
  number of functions or the length of the descriptions, break down complex
  tasks into smaller, more focused function sets.

- **Mix of bash and custom tools** For those building with a mix of bash and
  custom tools, Gemini 3.1 Pro Preview
  comes with a separate endpoint available via the API called
  [`gemini-3.1-pro-preview-customtools`](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview#gemini-31-pro-preview-customtools).

## Notes and limitations

- Positioning of function call parts: When using custom function declarations [alongside built-in tools](https://ai.google.dev/gemini-api/docs/tool-combination) (like Google Search), the model may return a mix of `functionCall`, `toolCall`, and `toolResponse` parts in a single turn. Because of this, don't assume the `functionCall` will always be the last item in the parts array. If you are manually parsing the JSON response, always iterate through the parts array rather than relying on position.
- Only a [subset of the OpenAPI
  schema](https://ai.google.dev/api/caching#FunctionDeclaration) is supported.
- For `ANY` mode, the API may reject very large or deeply nested schemas. If you encounter errors, try simplifying your function parameter and response schemas by shortening property names, reducing nesting, or limiting the number of function declarations.
- Supported parameter types in Python are limited.
- Automatic function calling is a Python SDK feature only.

# Function calling with the Gemini API

> [!NOTE]
> **Note** : This version of the page covers the new [Interactions API](https://ai.google.dev/gemini-api/docs/interactions), which is currently in Beta.  
> For stable production deployments, we recommend you continue to use the `generateContent` API. You can use the toggle on this page to switch between the versions.

Function calling lets you connect models to external tools and APIs.
Instead of generating text responses, the model determines when to call specific
functions and provides the necessary parameters to execute real-world actions.
This allows the model to act as a bridge between natural language and real-world
actions and data. Function calling has 3 primary use cases:

- **Augment Knowledge:** Access information from external sources like databases, APIs, and knowledge bases.
- **Extend Capabilities:** Use external tools to perform computations and extend the limitations of the model, such as using a calculator or creating charts.
- **Take Actions:** Interact with external systems using APIs, such as scheduling appointments, creating invoices, sending emails, or controlling smart home devices.

> [!NOTE]
> **Important:** Gemini 3 model APIs now generate a unique `id` for every function call. When returning the result of your executed function to the model, we recommend passing the matching `id` in your `function_result`. If you are using the standard Python or Node.js SDKs, this is handled automatically.

<button value="weather">Get Weather</button> <button value="meeting" default="">Schedule Meeting</button> <button value="chart">Create Chart</button>

### Python

    from google import genai

    schedule_meeting_function = {
        "type": "function",
        "name": "schedule_meeting",
        "description": "Schedules a meeting with specified attendees at a given time and date.",
        "parameters": {
            "type": "object",
            "properties": {
                "attendees": {"type": "array", "items": {"type": "string"}},
                "date": {"type": "string", "description": "Date (e.g., '2024-07-29')"},
                "time": {"type": "string", "description": "Time (e.g., '15:00')"},
                "topic": {"type": "string", "description": "The meeting topic."},
            },
            "required": ["attendees", "date", "time", "topic"],
        },
    }

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Schedule a meeting with Bob and Alice for 03/14/2025 at 10:00 AM about Q3 planning.",
        tools=[{"type": "function", **schedule_meeting_function}],
    )

    for step in interaction.steps:
        if step.type == "function_call":
            print(f"Function to call: {step.name}")
            print(f"Arguments: {step.arguments}")

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const scheduleMeetingFunction = {
      type: 'function',
      name: 'schedule_meeting',
      description: 'Schedules a meeting with specified attendees at a given time and date.',
      parameters: {
        type: 'object',
        properties: {
          attendees: { type: 'array', items: { type: 'string' } },
          date: { type: 'string', description: 'Date (e.g., "2024-07-29")' },
          time: { type: 'string', description: 'Time (e.g., "15:00")' },
          topic: { type: 'string', description: 'The meeting topic.' },
        },
        required: ['attendees', 'date', 'time', 'topic'],
      },
    };

    const interaction = await client.interactions.create({
      model: 'gemini-3-flash-preview',
      input: 'Schedule a meeting with Bob and Alice for 03/27/2025 at 10:00 AM about Q3 planning.',
      tools: [scheduleMeetingFunction],
    });

    for (const step of interaction.steps) {
      if (step.type === 'function_call') {
        console.log(`Function to call: ${step.name}`);
        console.log(`Arguments: ${JSON.stringify(step.arguments)}`);
      }
    }

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3-flash-preview",
        "input": "Schedule a meeting with Bob and Alice for 03/27/2025 at 10:00 AM about Q3 planning.",
        "tools": [{
            "type": "function",
            "name": "schedule_meeting",
            "description": "Schedules a meeting with specified attendees at a given time and date.",
            "parameters": {
              "type": "object",
              "properties": {
                "attendees": {"type": "array", "items": {"type": "string"}},
                "date": {"type": "string"},
                "time": {"type": "string"},
                "topic": {"type": "string"}
              },
              "required": ["attendees", "date", "time", "topic"]
            }
        }]
      }'

## How function calling works

![function calling overview](https://ai.google.dev/static/gemini-api/docs/images/function-calling-overview.png)

Function calling involves a structured interaction between your application, the
model, and external functions:

1. **Define Function Declaration:** Define the function's name, parameters, and purpose to the model.
2. **Call LLM with function declarations:** Send user prompt along with the function declaration(s) to the model.
3. **Execute Function Code (Your Responsibility):** The model *doesn't* execute the function itself. Extract the name and args and execute in your application.
4. **Create User friendly response:** Send the result back to the model for a final, user-friendly response.

This process can be repeated over multiple turns. The model supports calling
multiple functions in a single turn ([parallel function calling](https://ai.google.dev/gemini-api/docs/interactions/function-calling#parallel_function_calling)) and in
sequence ([compositional function calling](https://ai.google.dev/gemini-api/docs/interactions/function-calling#compositional_function_calling)).

### Step 1: Define a function declaration

### Python

    set_light_values_declaration = {
        "type": "function",
        "name": "set_light_values",
        "description": "Sets the brightness and color temperature of a light.",
        "parameters": {
            "type": "object",
            "properties": {
                "brightness": {
                    "type": "integer",
                    "description": "Light level from 0 to 100",
                },
                "color_temp": {
                    "type": "string",
                    "enum": ["daylight", "cool", "warm"],
                    "description": "Color temperature",
                },
            },
            "required": ["brightness", "color_temp"],
        },
    }

    def set_light_values(brightness: int, color_temp: str) -> dict:
        """Set the brightness and color temperature of a room light."""
        return {"brightness": brightness, "colorTemperature": color_temp}

### JavaScript

    const setLightValuesTool = {
      type: 'function',
      name: 'set_light_values',
      description: 'Sets the brightness and color temperature of a light.',
      parameters: {
        type: 'object',
        properties: {
          brightness: { type: 'number', description: 'Light level from 0 to 100' },
          color_temp: { type: 'string', enum: ['daylight', 'cool', 'warm'] },
        },
        required: ['brightness', 'color_temp'],
      },
    };

    function setLightValues(brightness, color_temp) {
      return { brightness: brightness, colorTemperature: color_temp };
    }

### Step 2: Call the model with function declarations

### Python

    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Turn the lights down to a romantic level",
        tools=[set_light_values_declaration],
    )

    # Find the function call step
    fc_step = next(s for s in interaction.steps if s.type == "function_call")
    print(fc_step)

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
      model: 'gemini-3-flash-preview',
      input: 'Turn the lights down to a romantic level',
      tools: [setLightValuesTool],
    });

    // Find the function call step
    const fcStep = interaction.steps.find(s => s.type === 'function_call');
    console.log(fcStep);

The model returns a `function_call` step with `type`, `name`, and `arguments`:

    type='function_call'
    name='set_light_values'
    arguments={'color_temp': 'warm', 'brightness': 25}

### Step 3: Execute the function

### Python

    fc_step = next(s for s in interaction.steps if s.type == "function_call")

    if fc_step.name == "set_light_values":
        result = set_light_values(**fc_step.arguments)
        print(f"Function execution result: {result}")

### JavaScript

    const fcStep = interaction.steps.find(s => s.type === 'function_call');

    let result;
    if (fcStep.name === 'set_light_values') {
      result = setLightValues(fcStep.arguments.brightness, fcStep.arguments.color_temp);
      console.log(`Function execution result: ${JSON.stringify(result)}`);
    }

### Step 4: Send result back to model

### Python

    final_interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input=[
            {
                "type": "function_result",
                "name": fc_step.name,
                "call_id": fc_step.id,
                "result": [{"type": "text", "text": json.dumps(result)}],
            }
        ],
        tools=[set_light_values_declaration],
        previous_interaction_id=interaction.id,
    )

    print(final_interaction.steps[-1].content[0].text)

### JavaScript

    const finalInteraction = await client.interactions.create({
      model: 'gemini-3-flash-preview',
      input: [{
        type: 'function_result',
        name: fcStep.name,
        call_id: fcStep.id,
        result: [{ type: 'text', text: JSON.stringify(result) }]
      }],
      tools: [setLightValuesTool],
      previousInteractionId: interaction.id,
    });

    console.log(finalInteraction.steps.at(-1).content[0].text);

## Function declarations

A function declaration is passed as a tool and includes:

- `type` (string): Must be `"function"` for custom functions.
- `name` (string): Unique function name (use underscores or camelCase).
- `description` (string): Clear explanation of the function's purpose.
- `parameters` (object): Input parameters the function expects.
  - `type` (string): Overall data type, such as `object`.
  - `properties` (object): Individual parameters with type and description.
  - `required` (array): Mandatory parameter names.

## Function calling with thinking models

Gemini 3 and 2.5 series models use an internal ["thinking"](https://ai.google.dev/gemini-api/docs/interactions/thinking) process that improves function calling.
The SDKs automatically handle [thought signatures](https://ai.google.dev/gemini-api/docs/interactions/thought-signatures) for you.

## Parallel function calling

Call multiple functions at once when they are independent:

### Python

    power_disco_ball = {"type": "function", "name": "power_disco_ball", "description": "Powers the disco ball.",
        "parameters": {"type": "object", "properties": {"power": {"type": "boolean"}}, "required": ["power"]}}
    start_music = {"type": "function", "name": "start_music", "description": "Play music.",
        "parameters": {"type": "object", "properties": {"energetic": {"type": "boolean"}, "loud": {"type": "boolean"}}, "required": ["energetic", "loud"]}}
    dim_lights = {"type": "function", "name": "dim_lights", "description": "Dim the lights.",
        "parameters": {"type": "object", "properties": {"brightness": {"type": "number"}}, "required": ["brightness"]}}

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="Turn this place into a party!",
        tools=[power_disco_ball, start_music, dim_lights],
        generation_config={"tool_choice": "any"},
    )

    for step in interaction.steps:
        if step.type == "function_call":
            args = ", ".join(f"{key}={val}" for key, val in step.arguments.items())
            print(f"{step.name}({args})")

### JavaScript

    const powerDiscoBall = { type: 'function', name: 'power_disco_ball', description: 'Powers the disco ball.',
      parameters: { type: 'object', properties: { power: { type: 'boolean' } }, required: ['power'] } };
    const startMusic = { type: 'function', name: 'start_music', description: 'Play music.',
      parameters: { type: 'object', properties: { energetic: { type: 'boolean' }, loud: { type: 'boolean' } }, required: ['energetic', 'loud'] } };
    const dimLights = { type: 'function', name: 'dim_lights', description: 'Dim the lights.',
      parameters: { type: 'object', properties: { brightness: { type: 'number' } }, required: ['brightness'] } };

    const interaction = await client.interactions.create({
      model: 'gemini-3-flash-preview',
      input: 'Turn this place into a party!',
      tools: [powerDiscoBall, startMusic, dimLights],
      generationConfig: { toolChoice: 'any' },
    });

    for (const step of interaction.steps) {
      if (step.type === 'function_call') {
        console.log(`${step.name}(${JSON.stringify(step.arguments)})`);
      }
    }

## Compositional function calling

Chain multiple function calls together for complex requests (e.g., get location
first, then get weather for that location).

### Python

    def get_weather_forecast(location: str) -> dict:
        """Gets the current weather temperature for a given location."""
        return {"temperature": 25, "unit": "celsius"}

    def set_thermostat_temperature(temperature: int) -> dict:
        """Sets the thermostat to a desired temperature."""
        return {"status": "success"}

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="If it's warmer than 20°C in London, set the thermostat to 20°C, otherwise 18°C.",
        tools=[get_weather_forecast, set_thermostat_temperature],
    )

    print(interaction.steps[-1].content[0].text)

## Function calling modes

Control how the model uses tools using `tool_choice` in `generation_config`:

- `auto` (Default): Model decides whether to call a function or respond directly.
- `any`: Model is constrained to always predict a function call.
- `none`: Model is prohibited from making function calls.
- `validated` (Preview): Model ensures function schema adherence.

### Python

    generation_config = {
        "tool_choice": {
            "allowed_tools": {
                "mode": "any",
                "tools": ["get_current_temperature"]
            }
        }
    }

### JavaScript

    const generationConfig = {
      toolChoice: {
        allowedTools: {
          mode: 'any',
          tools: ['get_current_temperature']
        }
      }
    };

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: \$GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3-flash-preview",
        "input": "What is the temperature in Boston?",
        "tools": [{
          "type": "function",
          "name": "get_current_temperature",
          "description": "Gets the current temperature for a given location.",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {"type": "string"}
            },
            "required": ["location"]
          }
        }],
        "generation_config": {
          "tool_choice": {
            "allowed_tools": {
              "mode": "any",
              "tools": ["get_current_temperature"]
            }
          }
        }
      }'

## Multi-tool use

You can enable multiple tools, combining built-in tools with function calling in
the same request. Gemini 3 models can combine built-in tools with function
calling out-of-the-box in Interactions. Passing `previous_interaction_id`
automatically circulates the built-in tool context.

### Python

    from google import genai
    import json

    client = genai.Client()

    get_weather = {
        "type": "function",
        "name": "get_weather",
        "description": "Gets the weather for a requested city.",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "The city and state, e.g. Utqiaġvik, Alaska",
                },
            },
            "required": ["city"],
        },
    }

    tools = [
        {"type": "google_search"},  # Built-in tool
        get_weather                 # Custom tool
    ]

    # Turn 1: Initial request with both tools enabled
    interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        input="What is the northernmost city in the United States? What's the weather like there today?",
        tools=tools
    )

    for step in interaction.steps:
        if step.type == "function_call":
            print(f"Function call: {step.name} (ID: {step.id})")
            # Execute your custom function locally
            result = {"response": "Very cold. 22 degrees Fahrenheit."}
            # Turn 2: Provide the function result back to the model.
            # Passing `previous_interaction_id` automatically circulates the
            # built-in Google Search context from Turn 1
            interaction_2 = client.interactions.create(
                model="gemini-3-flash-preview",
                previous_interaction_id=interaction.id,
                tools=tools,
                input=[{
                    "type": "function_result",
                    "name": step.name,
                    "call_id": step.id,
                    "result": [{"type": "text", "text": json.dumps(result)}]
                }]
            )

            print(interaction_2.steps[-1].content[0].text)

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const weatherTool = {
        type: 'function',
        name: 'get_weather',
        description: 'Gets the weather for a given location.',
        parameters: {
            type: 'object',
            properties: {
                location: { type: 'string', description: 'The city and state, e.g. San Francisco, CA' }
            },
            required: ['location']
        }
    };

    const tools = [
        {type: 'google_search'}, // Built-in tool
        weatherTool              // Custom tool
    ];

    // Turn 1: Initial request with both tools enabled
    let interaction = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: "What is the northernmost city in the United States? What's the weather like there today?",
        tools: tools
    });

    for (const step of interaction.steps) {
        if (step.type === 'function_call') {
            console.log(`Function call: ${step.name} (ID: ${step.id})`);
            // Execute your custom function locally
            const result = {response: "Very cold. 22 degrees Fahrenheit."};
            // Turn 2: Provide the function result back to the model.
            const interaction_2 = await client.interactions.create({
                model: 'gemini-3-flash-preview',
                previousInteractionId: interaction.id,
                tools: tools,
                input: [{
                    type: 'function_result',
                    name: step.name,
                    call_id: step.id,
                    result: [{ type: 'text', text: JSON.stringify(result) }]
                }]
            });

            console.log(interaction_2.steps.at(-1).content[0].text);
        }
    }

## Multimodal function responses

For Gemini 3 series models, you can include multimodal content in
the function response parts that you send to the model. The model can process
this multimodal content in its next turn to produce a more informed response.

To include multimodal data in a function response, include it as one or more content blocks in the `result` field of the `function_result` step. Each content block must specify its `type` (e.g., `"text"`, `"image"`).

The following example shows how to send a function response containing image data back to the model in an interaction:

### Python

    import base64
    from google import genai
    import requests

    client = genai.Client()

    # Find the function call step
    tool_call = next(s for s in interaction.steps if s.type == "function_call")

    # Execute your tool to get image bytes
    image_path = "https://goo.gle/instrument-img"
    image_bytes = requests.get(image_path).content

    base64_image_data = base64.b64encode(image_bytes).decode("utf-8")

    final_interaction = client.interactions.create(
        model="gemini-3-flash-preview",
        previous_interaction_id=interaction.id,
        input=[
            {
                "type": "function_result",
                "name": tool_call.name,
                "call_id": tool_call.id,
                "result": [
                    {"type": "text", "text": "instrument.jpg"},
                    {
                        "type": "image",
                        "mime_type": "image/jpeg",
                        "data": base64_image_data,
                    },
                ],
            }
        ],
    )

    print(final_interaction.steps[-1].content[0].text)

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    // Find the function call step
    const toolCall = interaction.steps.find(s => s.type === 'function_call');

    // Execute your tool to get image bytes and convert to base64
    // (Implementation depends on your environment)
    const base64ImageData = "BASE64_IMAGE_DATA";

    const finalInteraction = await ai.interactions.create({
        model: 'gemini-3-flash-preview',
        previousInteractionId: interaction.id,
        input: [{
            type: 'function_result',
            name: toolCall.name,
            call_id: toolCall.id,
            result: [
                { type: 'text', text: 'instrument.jpg' },
                {
                    type: 'image',
                    mimeType: 'image/jpeg',
                    data: base64ImageData,
                }
            ]
        }]
    });

    console.log(finalInteraction.steps.at(-1).content[0].text);

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: \$GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-3-flash-preview",
        "previous_interaction_id": "INTERACTION_ID",
        "input": [
          {
            "type": "function_result",
            "name": "get_image",
            "call_id": "call_123",
            "result": [
              {"type": "text", "text": "instrument.jpg"},
              {
                "type": "image",
                "mime_type": "image/jpeg",
                "data": "BASE64_IMAGE_DATA"
              }
            ]
          }
        ]
      }'

## Function calling with Structured output

For Gemini 3 series models, combine function calling with
[structured output](https://ai.google.dev/gemini-api/docs/interactions/structured-output) for
consistently formatted responses.

## Remote MCP (Model Context Protocol)

Interactions API supports connecting to remote MCP servers to give the model access to external tools and services. You provide the server `name` and `url` in the tools configuration.

When using Remote MCP, be aware of the following constraints:

- **Server types**: Remote MCP only works with Streamable HTTP servers. SSE (Server-Sent Events) servers are not supported.
- **Model support**: Remote MCP does not work with Gemini 3 models at this time. Support for Gemini 3 is coming soon.
- **Naming** : MCP server names should not include the `-` character. Use `snake_case` server names instead.

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `string` | Yes | Must be `"mcp_server"`. |
| `name` | `string` | No | A display name for the MCP server. |
| `url` | `string` | No | The full URL for the MCP server endpoint. |
| `headers` | `object` | No | Key-value pairs sent as HTTP headers with every request to the server (for example, authentication tokens). |
| `allowed_tools` | `array` | No | Restrict which tools from the server the agent may call. |

### Example

### Python

    from google import genai

    client = genai.Client()

    interaction = client.interactions.create(
        model="gemini-2.5-flash",
        input="Check the status of my last server deployment.",
        tools=[
            {
                "type": "mcp_server",
                "name": "Deployment Tracker",
                "url": "https://mcp.example.com/mcp",
                "headers": {"Authorization": "Bearer my-token"},
            }
        ]
    )

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
        model: 'gemini-2.5-flash',
        input: 'Check the status of my last server deployment.',
        tools: [
            {
                type: 'mcp_server',
                name: 'Deployment Tracker',
                url: 'https://mcp.example.com/mcp',
                headers: { Authorization: 'Bearer my-token' }
            }
        ]
    });

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-2.5-flash",
        "input": "Check the status of my last server deployment.",
        "tools": [
            {
                "type": "mcp_server",
                "name": "Deployment Tracker",
                "url": "https://mcp.example.com/mcp",
                "headers": {"Authorization": "Bearer my-token"}
            }
        ]
    }'

## Stream tool calls

When using tools with streaming, the model generates function calls as a
sequence of `step.delta` events on the stream. Tool arguments can be streamed as partial arguments using `arguments`. You must aggregate these deltas to reconstruct the complete tool calls before executing them.

### Python

    import json
    from google import genai

    client = genai.Client()

    weather_tool = {
        "type": "function",
        "name": "get_weather",
        "description": "Gets the weather for a given location.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "The city and state"}
            },
            "required": ["location"]
        }
    }

    stream = client.interactions.create(
        model="gemini-3-flash-preview",
        input="What is the weather in Paris?",
        tools=[weather_tool],
        stream=True
    )

    current_calls = {}
    tool_calls = []

    for event in stream:
        if event.event_type == "step.start":
            if event.step.type == "function_call":
                current_calls[event.index] = {
                    "id": event.step.id,
                    "name": event.step.name,
                    "arguments": ""
                }
        elif event.event_type == "step.delta":
            if event.delta.type == "arguments":
                if event.index in current_calls:
                    current_calls[event.index]["arguments"] += event.delta.partial_arguments
            elif event.delta.type == "text":
                print(event.delta.text, end="", flush=True)

        elif event.event_type == "interaction.completed":
            for index, call in current_calls.items():
                args = call["arguments"]
                if args:
                    args = json.loads(args)
                else:
                    args = {}

                tool_calls.append({
                    "type": "function_call",
                    "id": call["id"],
                    "name": call["name"],
                    "arguments": args
                })

            print(f"\nFinal tool calls ready to execute:")
            print(json.dumps(tool_calls, indent=2))

### JavaScript

    import { GoogleGenAI } from '@google/genai';

    const client = new GoogleGenAI({});

    const weatherTool = {
        type: 'function',
        name: 'get_weather',
        description: 'Gets the weather for a given location.',
        parameters: {
            type: 'object',
            properties: {
                location: { type: 'string', description: 'The city and state' }
            },
            required: ['location']
        }
    };

    const stream = await client.interactions.create({
        model: 'gemini-3-flash-preview',
        input: 'What is the weather in Paris?',
        tools: [weatherTool],
        stream: true,
    });

    const currentCalls = new Map();
    let toolCalls = [];

    for await (const event of stream) {
        if (event.type === 'step.start') {
            if (event.step.type === 'function_call') {
                currentCalls.set(event.index, {
                    id: event.step.id,
                    name: event.step.name,
                    arguments: ''
                });
            }
        } else if (event.type === 'step.delta') {
            if (event.delta.type === 'arguments') {
                if (currentCalls.has(event.index)) {
                    currentCalls.get(event.index).arguments += event.delta.partial_arguments;
                }
            } else if (event.delta.type === 'text') {
                process.stdout.write(event.delta.text);
            }
        } else if (event.type === 'interaction.completed') {
            toolCalls = Array.from(currentCalls.values()).map(call => ({
                type: 'function_call',
                id: call.id,
                name: call.name,
                arguments: call.arguments ? JSON.parse(call.arguments) : {}
            }));
            console.log('\nFinal tool calls ready to execute:');
            console.log(JSON.stringify(toolCalls, null, 2));
        }
    }

### REST

    curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "model": "gemini-3-flash-preview",
        "input": "What is the weather in Paris?",
        "tools": [{
            "type": "function",
            "name": "get_weather",
            "description": "Gets the weather for a given location.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "The city and state"}
                },
                "required": ["location"]
            }
        }],
        "stream": true
    }'

## Supported models

| Model | Function Calling | Parallel | Compositional |
|---|---|---|---|
| Gemini 3.1 Pro Preview | ✔️ | ✔️ | ✔️ |
| Gemini 3 Flash Preview | ✔️ | ✔️ | ✔️ |
| Gemini 2.5 Pro | ✔️ | ✔️ | ✔️ |
| Gemini 2.5 Flash | ✔️ | ✔️ | ✔️ |
| Gemini 2.5 Flash-Lite | ✔️ | ✔️ | ✔️ |
| Gemini 2.0 Flash | ✔️ | ✔️ | ✔️ |
| Gemini 2.0 Flash-Lite | X | X | X |

## Best practices

- **Function and Parameter Descriptions:** Be clear and specific.
- **Naming:** Use descriptive names without spaces or special characters.
- **Strong Typing:** Use specific types (integer, string, enum).
- **Tool Selection:** Keep active set to 10-20 tools maximum.
- **Prompt Engineering:** Provide context and instructions.
- **Temperature:** Use low temperature (e.g., 0) for deterministic calls.

  > [!NOTE]
  > When using Gemini 3 models, we strongly recommend keeping the `temperature` at its default value of 1.0. Changing the temperature (setting it less than 1.0) may lead to unexpected behavior, such as looping or degraded performance, particularly in complex mathematical or reasoning tasks.

- **Validation:** Validate function calls before executing.

- **Error Handling:** Implement robust error handling.

- **Security:** Use appropriate authentication for external APIs.

## Notes and limitations

- Only a [subset of the OpenAPI schema](https://ai.google.dev/api/rest/v1beta/cachedContents#FunctionDeclaration) is supported.
- For `any` mode, the API may reject very large or deeply nested schemas.
- Supported parameter types in Python are limited.

---
title: Getting Started
subtitle: >-
  An introduction to using Deepgram's Aura Text-to-Speech REST API to convert
  text into audio.
slug: docs/text-to-speech
---

<Card
    href="https://playground.deepgram.com/?endpoint=speak"
>
  <div class="t-default text-base font-semibold">Deepgram API Playground</div>
  Try this feature out in our API Playground.
</Card>
<br/>

<div class="flex flex-row gap-2">
  <span class="dg-badge"><span><Icon icon="megaphone" /> Text to Speech Request</span></span>
  
</div>

This guide will walk you through how to turn text into speech with Deepgram's text-to-speech REST API.

<Info>
  Before you start, you'll need to follow the steps in the [Make Your First API Request](/guides/fundamentals/make-your-first-api-request) guide to obtain a Deepgram API key, and configure your environment if you are choosing to use a Deepgram SDK.
</Info>

## CURL

Next, try it with CURL. Add your own API key where it says `YOUR_DEEPGRAM_API_KEY` and then run the following example in a terminal or your favorite API client.

<CodeGroup>
  ```bash cURL
  curl --request POST \
       --header "Content-Type: application/json" \
       --header "Authorization: Token DEEPGRAM_API_KEY" \
       --output your_output_file.mp3 \
       --write-out "Time-to-First-Byte: %{time_starttransfer}s Time-to-Last-Byte: %{time_total}s\n" \
       --data '{"text":"Hello, how can I help you today?"}' \
       --url "https://api.deepgram.com/v1/speak?model=aura-2-thalia-en"
  ```
</CodeGroup>

This will result in an MP3 audio file being streamed back to you by Deepgram. You can play the audio as soon as you receive the first byte, or you can wait until the entire MP3 file has arrived.

The audio file will contain the voice of the selected model saying the words that you sent in your request.

<Info>
  If you do not specify a `model`, the default voice model `aura-asteria-en` will be used. You can find all of our available voices [here](/docs/tts-models).
</Info>

### Send Error Messages to Terminal

If your request results in an error, the error message can be seen by opening the output audio file in a text editor.

To see the error message in your terminal, add this to your CURL request:

<CodeGroup>
  ```bash cURL
  --fail-with-body \
  --silent \
  || (jq . your_output_file.mp3 && rm your_output_file.mp3)
  ```
</CodeGroup>

This example will capture the error message using the [JQ](https://jqlang.org/) JSON processor library and remove the output file `tts.mp3` automatically.

<CodeGroup>
  ```bash cURL
  curl --request POST \
       --header "Content-Type: application/json" \
       --header "Authorization: Token DEEPGRAM_API_KEY" \
       --output your_output_file.mp3 \
       --write-out "Time-to-First-Byte: %{time_starttransfer}s Time-to-Last-Byte: %{time_total}s\n" \
       --data '{"text":"Hello, how can I help you today?"}' \
       --url 'https://api.deepgram.com/v1/speak?model=testing_error' \
       --fail-with-body \
       --silent \
       || (jq . your_output_file.mp3 && rm your_output_file.mp3)
  ```
</CodeGroup>

## SDKs

Deepgram has several SDKs that can make it easier to use the API. Follow these steps to use the SDK of your choice to make a Deepgram TTS request.

### Install the SDK

Open your terminal, navigate to the location on your drive where you want to create your project, and install the Deepgram SDK.

<CodeGroup>
  ```shell JavaScript
  # Install the Deepgram JS SDK
  # https://github.com/deepgram/deepgram-js-sdk

  npm install @deepgram/sdk
  ```

  ```shell Python
  # Install the Deepgram Python SDK
  # https://github.com/deepgram/deepgram-python-sdk

  pip install deepgram-sdk
  ```

  ```shell Go
  # Install the Deepgram Go SDK
  # https://github.com/deepgram/deepgram-go-sdk

  go get github.com/deepgram/deepgram-go-sdk
  ```

  ```shell C#
  dotnet add package Deepgram
  ```

  ```shell Java
  # Install the Deepgram Java SDK
  # https://github.com/deepgram/deepgram-java-sdk

  # Maven — add to pom.xml:
  # <dependency>
  #   <groupId>com.deepgram</groupId>
  #   <artifactId>deepgram-java-sdk</artifactId>
  #   <version>0.2.1</version>
  # </dependency>

  # Gradle — add to build.gradle:
  # implementation 'com.deepgram:deepgram-java-sdk:0.2.1'
  ```
</CodeGroup>

### Add Dependencies

<CodeGroup>
  ```shell JavaScript
  # Install dotenv to protect your api key

  npm install dotenv
  ```

  ```shell Python
  # Install python-dotenv to protect your api key

  pip install python-dotenv
  ```

  ```shell Go
  # Importing the Deepgram Go SDK should pull in all dependencies required
  ```

  ```shell C#
  # Importing the Deepgram Go SDK should pull in all dependencies required
  ```
</CodeGroup>

### Make the Request with the SDK

<CodeGroup>
  ```javascript JavaScript
  const { DeepgramClient } = require("@deepgram/sdk");
  const fs = require("fs");

  // STEP 1: Create a Deepgram client with your API key
  const deepgram = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY });

  const text = "Hello, how can I help you today?";

  const getAudio = async () => {
    // STEP 2: Make a request and configure the request with options (such as model choice, audio configuration, etc.)
    const response = await deepgram.speak.v1.audio.generate({
      text,
      model: "aura-2-thalia-en",
      encoding: "linear16",
      container: "wav",
    });

    // STEP 3: Get the audio stream and headers from the response
    const stream = response.stream;
    const headers = response.headers;
    if (stream) {
      // STEP 4: Convert the stream to an audio buffer
      const buffer = await getAudioBuffer(stream);
      // STEP 5: Write the audio buffer to a file
      fs.writeFile("output.wav", buffer, (err) => {
        if (err) {
          console.error("Error writing audio to file:", err);
        } else {
          console.log("Audio file written to output.wav");
        }
      });
    } else {
      console.error("Error generating audio:", stream);
    }

    if (headers) {
      console.log("Headers:", headers);
    }
  };

  // helper function to convert stream to audio buffer
  const getAudioBuffer = async (response) => {
    const reader = response.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
    }

    const dataArray = chunks.reduce(
      (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
      new Uint8Array(0)
    );

    return Buffer.from(dataArray.buffer);
  };

  getAudio();
  ```

  ```python Python
  # For more Python SDK migration guides, visit:
  # https://github.com/deepgram/deepgram-python-sdk/tree/main/docs

  import os
  import logging

  from deepgram import (
      DeepgramClient,
  )

  def main():
      try:
          # STEP 1 Create a Deepgram client using the API key from environment variables
          deepgram = DeepgramClient()

          # STEP 2 Call the generate method on the speak property
          response = deepgram.speak.v1.audio.generate(
              text="Hello world!",
              model="aura-2-thalia-en"
          )

          # Save the audio file
          with open("test.mp3", "wb") as audio_file:
              audio_file.write(response.stream.getvalue())

          print(f"Audio saved to test.mp3")

      except Exception as e:
          print(f"Exception: {e}")

  if __name__ == "__main__":
      main()
  ```

  ```go Go
  package main

  import (
  	"context"
  	"encoding/json"
  	"fmt"
  	"os"

  	prettyjson "github.com/hokaccha/go-prettyjson"

  	speak "github.com/deepgram/deepgram-go-sdk/pkg/api/speak/v1"
  	interfaces "github.com/deepgram/deepgram-go-sdk/pkg/client/interfaces"
  	client "github.com/deepgram/deepgram-go-sdk/pkg/client/speak"
  )

  const (
  	textToSpeech string = "Hello, how can I help you today?"
  	filePath     string = "./output.wav"
  )

  func main() {
  	// STEP 1: init Deepgram client library
  	client.InitWithDefault()

  	// STEP 2: define context to manage the lifecycle of the request
  	ctx := context.Background()

  	// STEP 3: define options for the request
  	options := interfaces.SpeakOptions{
  		Model:     "aura-2-thalia-en",
  		Encoding:  "linear16",
  		Container: "wav",
  	}

  	// STEP 4: create a Deepgram client using default settings
  	// NOTE: you can set your API KEY in your bash profile by typing the following line in your shell:
  	// export DEEPGRAM_API_KEY = "YOUR_DEEPGRAM_API_KEY"
  	c := client.NewWithDefaults()
  	dg := speak.New(c)

  	// STEP 5: send/process file to Deepgram
  	res, err := dg.ToSave(ctx, filePath, textToSpeech, options)
  	if err != nil {
  		fmt.Printf("FromStream failed. Err: %v\n", err)
  		os.Exit(1)
  	}

  	// STEP 6: get the JSON response
  	data, err := json.Marshal(res)
  	if err != nil {
  		fmt.Printf("json.Marshal failed. Err: %v\n", err)
  		os.Exit(1)
  	}

  	// STEP 8: make the JSON pretty
  	prettyJson, err := prettyjson.Format(data)
  	if err != nil {
  		fmt.Printf("prettyjson.Marshal failed. Err: %v\n", err)
  		os.Exit(1)
  	}
  	fmt.Printf("\n\nResult:\n%s\n\n", prettyJson)
  }
  ```

  ```csharp C#
  using Deepgram.Models.Speak.v1.REST;

  namespace SampleApp
  {
      class Program
      {
          static async Task Main(string[] args)
          {
              // Initialize Library with default logging
              // Normal logging is "Info" level
              Library.Initialize();

              // use the client factory with a API Key set with the "DEEPGRAM_API_KEY" environment variable
              var deepgramClient = ClientFactory.CreateSpeakRESTClient();

              var response = await deepgramClient.ToFile(
                  new TextSource("Hello World!"),
                  "test.mp3",
                  new SpeakSchema()
                  {
                      Model = "aura-2-thalia-en",
                  });

              //Console.WriteLine(response);
              Console.WriteLine(response);
              Console.ReadKey();

              // Teardown Library
              Library.Terminate();
          }
      }
  }
  ```

  ```java Java
  // Main.java (Java example)
  // https://github.com/deepgram/deepgram-java-sdk

  import java.io.InputStream;
  import java.nio.file.Files;
  import java.nio.file.Path;
  import java.nio.file.StandardCopyOption;
  import com.deepgram.DeepgramClient;
  import com.deepgram.resources.speak.v1.audio.requests.SpeakV1Request;

  public class Main {
      public static void main(String[] args) throws Exception {
          // Create a client using DEEPGRAM_API_KEY from the environment
          DeepgramClient client = DeepgramClient.builder().build();

          // Generate speech audio
          InputStream audioStream = client.speak().v1().audio().generate(
              SpeakV1Request.builder()
                  .text("Hello, how can I help you today?")
                  .build()
          );

          // Save to file
          Files.copy(audioStream, Path.of("output.mp3"), StandardCopyOption.REPLACE_EXISTING);
          System.out.println("Audio saved to output.mp3");
      }
  }
  ```
</CodeGroup>

<Info>
  To learn more about how you can customize the audio file to meet the needs of your use case, take a look at this [Audio Format Combinations](/docs/tts-media-output-settings#audio-format-combinations) table.
</Info>

## Non-SDK Code Examples

If you would like to try out making a Deepgram speech-to-text request in a specific language (but not using Deepgram's SDKs), we offer a library of code-samples in this [Github repo](https://github.com/deepgram-devs/code-samples). However, we recommend first trying out our SDKs, which we presented in the previous section.

## Results

Upon successful processing of the request, you will receive an audio file containing the synthesized text-to-speech output, along with response headers providing additional information.

<Info>
  The audio file is streamed back to you, so you may begin playback as soon as the first byte arrives. Read the guide [Streaming Audio Outputs](/docs/streaming-the-audio-output) to learn how to begin playing the stream immediately versus waiting for the entire file to arrive.
</Info>

### Example Response Headers

<CodeGroup>
  ```text http
  HTTP/1.1 200 OK
  < content-type: audio/mpeg
  < dg-model-name: aura-2-thalia-en
  < dg-model-uuid: e4979ab0-8475-4901-9d66-0a562a4949bb
  < dg-char-count: 32
  < dg-request-id: bf6fc5c7-8f84-479f-b70a-602cf5bf18f3
  < transfer-encoding: chunked
  < date: Thu, 29 Feb 2024 19:20:48 GMT
  ```
</CodeGroup>

<Info>
  To see these response headers when making a CURL request, add `-v` or `--verbose` to your request.
</Info>

This includes:

* `content-type`: Specifies the media type of the resource, in this case, `audio/mpeg`, indicating the format of the audio file returned.
* `dg-request-id`: A unique identifier for the request, useful for debugging and tracking purposes.
* `dg-model-uuid`: The unique identifier of the model that processed the request.
* `dg-char-count`: Indicates the number of characters that were in the input text for the text-to-speech process.
* `dg-model-name`: The name of the model used to process the request.
* `transfer-encoding`: Specifies the form of encoding used to safely transfer the payload to the recipient.
* `date`: The date and time the response was sent.

## Limits

Keep these limits in mind when making a Deepgram text-to-speech request.

### Input Text Limit

Sending a request with a text payload longer than the maximum number of characters can result in a [**413: Input Text Exceeds Character Limits**](/docs/errors#413-input-text-exceeded-character-limit) error, and the audio file will not be created.

| Model  | Max Characters|
|----------------|------|
| Aura-2, Aura-1 | 2000 |

### Unprocessable Content

A [**422: Unprocessable Content**](/docs/errors#422-unprocessable-content) error can be returned if the client fails to send the request successfully.

### Rate Limits

<Info>
  For information on Deepgram's Concurrency Rate Limits, refer to our [API Rate Limits Documentation](/reference/api-rate-limits).
</Info>

#### Handling Rate Limits

If the number of in-progress requests for a project meets or exceeds the rate limit, new requests will receive a **429: Too Many Requests** error.

<Info>
  For suggestions on handling Concurrency Rate Limits, refer to our [Working with Concurrency Rate Limits Documentation](/docs/working-with-concurrency-rate-limits) guide.
</Info>

## What's Next?

Now that you've transformed text into speech with Deepgram's API, enhance your knowledge by exploring the following areas.

### Template Apps

* Clone and run one of our [Template Apps](/docs/tts-rest-template-apps) to see a full application with a frontend UI and a backend server sending text to Deepgram to be converted into audio.

### Read the Feature Guides

Deepgram's features help you to customize your request to produce the output that works best for your use case.

* [Media Output Settings](/docs/tts-media-output-settings): Learn how to customize the audio file that is returned.
* [Callback](/docs/tts-callback): Discover how to provide a callback url, so that your audio can be processed asynchronously.
* [Feature Overview](/docs/tts-feature-overview): Review the list of features available for pre-recorded speech-to-text. Then, dive into individual guides for more details.

### Try the Conversational AI Demo

* The purpose of[ this demo](https://aura-tts-demo.deepgram.com/) is to showcase how you can build a Conversational AI application that engages users in natural language interactions, mimicking human conversation through natural language processing using Deepgram and [OpenAI ChatGPT.](https://openai.com/chatgpt)

### Watch This Video

* Watch this [video](https://www.youtube.com/watch?v=J2sbC8X5Pp8) to learn how you can use Deepgram Aura with [Groq](https://groq.com/) to build a blazing fast Conversational AI application.

***


---
title: Voices and Languages
subtitle: An overview of Deepgram's Aura text-to-speech voice models
slug: docs/tts-models
---

`model` *string*

<div class="flex flex-row gap-2">
  <span class="dg-badge"><span><Icon icon="megaphone" /> Text to Speech Request</span></span>
   <span class="dg-badge"><span><Icon icon="megaphone" /> Text to Speech Stream</span></span>
 
</div>

Deepgram offers a range of voices for its Aura text-to-speech API, each identified by a unique model name following the format `[modelname]-[voicename]-[language]`.

To select a model, use the syntax `model=aura-2-thalia-en`

## Example

<CodeGroup >
```curl CURL
curl "https://api.deepgram.com/v1/speak?model=aura-2-thalia-en" \
> -H "Content-Type: application/json" \
> -H "Authorization: Token YOUR_DEEPGRAM_API_KEY" \
> -d "{\"text\":\"Hello how are you?\"}" \
> --output outputfile_voice_model.wav \
> --fail-with-body \
> --silent || echo "Request failed"
```
</CodeGroup>

<Warning>
  Replace `YOUR_DEEPGRAM_API_KEY` with your [Deepgram API Key](/docs/create-additional-api-keys).
</Warning>

## Language Support

Deepgram's Aura text-to-speech supports the following languages:

- **English (en)** - American, British, Australian, Irish, Filipino accents
- **Spanish (es)** - Mexican, Peninsular, Colombian, Latin American accents
- **German (de)**
- **French (fr)**
- **Dutch (nl)**
- **Italian (it)**
- **Japanese (ja)**

<Info>
  We're constantly adding additional language support and making improvements to our voice models. Check back regularly for updates.
</Info>

---

## Aura-2 English Voices

### Featured Aura-2 English Voices

These are our featured English voices, selected for their versatility and quality:

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-thalia-en` | thalia | <audio id="thalia"  controls src="https://static.deepgram.com/examples/Aura-2-thalia.wav"></audio> | feminine | Adult | en-us | American | Clear, Confident, Energetic, Enthusiastic | Casual chat, customer service, IVR |
| `aura-2-andromeda-en` | andromeda | <audio id="andromeda"  controls src="https://static.deepgram.com/examples/Aura-2-andromeda.wav"></audio> | feminine | Adult | en-us | American | Casual, Expressive, Comfortable | Customer service, IVR |
| `aura-2-helena-en` | helena | <audio id="helena"  controls src="https://static.deepgram.com/examples/Aura-2-helena.wav"></audio> | feminine | Adult | en-us | American | Caring, Natural, Positive, Friendly, Raspy | IVR, casual chat |
| `aura-2-apollo-en` | apollo | <audio id="apollo"  controls src="https://static.deepgram.com/examples/Aura-2-apollo.wav"></audio> | masculine | Adult | en-us | American | Confident, Comfortable, Casual | Casual chat |
| `aura-2-arcas-en` | arcas | <audio id="arcas"  controls src="https://static.deepgram.com/examples/Aura-2-arcas.wav"></audio> | masculine | Adult | en-us | American | Natural, Smooth, Clear, Comfortable | Customer service, casual chat |
| `aura-2-aries-en` | aries | <audio id="aries"  controls src="https://static.deepgram.com/examples/Aura-2-aries.wav"></audio> | masculine | Adult | en-us | American | Warm, Energetic, Caring | Casual chat |

</div>

### Aura-2: All Available English Voices

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-amalthea-en` | amalthea | <audio id="amalthea" controls src="https://static.deepgram.com/examples/Aura-2-amalthea.wav"></audio> | feminine | Young Adult | en-ph | Filipino | Engaging, Natural, Cheerful | Casual chat |
| `aura-2-andromeda-en` | andromeda | <audio id="andromeda" controls src="https://static.deepgram.com/examples/Aura-2-andromeda.wav"></audio> | feminine | Adult | en-us | American | Casual, Expressive, Comfortable | Customer service, IVR |
| `aura-2-apollo-en` | apollo | <audio id="apollo"  controls src="https://static.deepgram.com/examples/Aura-2-apollo.wav"></audio> | masculine | Adult | en-us | American | Confident, Comfortable, Casual | Casual chat |
| `aura-2-arcas-en` | arcas | <audio id="arcas" controls src="https://static.deepgram.com/examples/Aura-2-arcas.wav"></audio> | masculine | Adult | en-us | American | Natural, Smooth, Clear, Comfortable | Customer service, casual chat |
| `aura-2-aries-en` | aries | <audio id="aries"  controls src="https://static.deepgram.com/examples/Aura-2-aries.wav"></audio> | masculine | Adult | en-us | American | Warm, Energetic, Caring | Casual chat |
| `aura-2-asteria-en` | asteria | <audio id="asteria" controls src="https://static.deepgram.com/examples/Aura-2-asteria.wav"></audio> | feminine | Adult | en-us | American | Clear, Confident, Knowledgeable, Energetic | Advertising |
| `aura-2-athena-en` | athena | <audio id="athena"  controls src="https://static.deepgram.com/examples/Aura-2-athena.wav"></audio> | feminine | Mature | en-us | American | Calm, Smooth, Professional | Storytelling |
| `aura-2-atlas-en` | atlas | <audio id="atlas"  controls src="https://static.deepgram.com/examples/Aura-2-atlas.wav"></audio> | masculine | Mature | en-us | American | Enthusiastic, Confident, Approachable, Friendly | Advertising |
| `aura-2-aurora-en` | aurora | <audio id="aurora"  controls src="https://static.deepgram.com/examples/Aura-2-aurora.wav"></audio> | feminine | Adult | en-us | American | Cheerful, Expressive, Energetic | Interview |
| `aura-2-callista-en` | callista | <audio id="callista"  controls src="https://static.deepgram.com/examples/Aura-2-callista.wav"></audio> | feminine | Adult | en-us | American | Clear, Energetic, Professional, Smooth | IVR |
| `aura-2-cora-en` | cora | <audio id="cora"  controls src="https://static.deepgram.com/examples/Aura-2-cora.wav"></audio> | feminine | Adult | en-us | American | Smooth, Melodic, Caring | Storytelling |
| `aura-2-cordelia-en` | cordelia | <audio id="cordelia"  controls src="https://static.deepgram.com/examples/Aura-2-cordelia.wav"></audio> | feminine | Young Adult | en-us | American | Approachable, Warm, Polite | Storytelling |
| `aura-2-delia-en` | delia | <audio id="delia"  controls src="https://static.deepgram.com/examples/Aura-2-delia.wav"></audio> | feminine | Young Adult | en-us | American | Casual, Friendly, Cheerful, Breathy | Interview |
| `aura-2-draco-en` | draco | <audio id="draco"  controls src="https://static.deepgram.com/examples/Aura-2-draco.wav"></audio> | masculine | Adult | en-gb | British | Warm, Approachable, Trustworthy, Baritone | Storytelling |
| `aura-2-electra-en` | electra | <audio id="electra"  controls src="https://static.deepgram.com/examples/Aura-2-electra.wav"></audio> | feminine | Adult | en-us | American | Professional, Engaging, Knowledgeable | IVR, advertising, customer service |
| `aura-2-harmonia-en` | harmonia | <audio id="harmonia"  controls src="https://static.deepgram.com/examples/Aura-2-harmonia.wav"></audio> | feminine | Adult | en-us | American | Empathetic, Clear, Calm, Confident | Customer service |
| `aura-2-helena-en` | helena | <audio id="helena"  controls src="https://static.deepgram.com/examples/Aura-2-helena.wav"></audio> | feminine | Adult | en-us | American | Caring, Natural, Positive, Friendly, Raspy | IVR, casual chat |
| `aura-2-hera-en` | hera | <audio id="hera"  controls src="https://static.deepgram.com/examples/Aura-2-hera.wav"></audio> | feminine | Adult | en-us | American | Smooth, Warm, Professional | Informative |
| `aura-2-hermes-en` | hermes | <audio id="hermes"  controls src="https://static.deepgram.com/examples/Aura-2-hermes.wav"></audio> | masculine | Adult | en-us | American | Expressive, Engaging, Professional | Informative |
| `aura-2-hyperion-en` | hyperion | <audio id="hyperion"  controls src="https://static.deepgram.com/examples/Aura-2-hyperion.wav"></audio> | masculine | Adult | en-au | Australian | Caring, Warm, Empathetic | Interview |
| `aura-2-iris-en` | iris | <audio id="iris"  controls src="https://static.deepgram.com/examples/Aura-2-iris.wav"></audio> | feminine | Young Adult | en-us | American | Cheerful, Positive, Approachable | IVR, advertising, customer service |
| `aura-2-janus-en` | janus | <audio id="janus"  controls src="https://static.deepgram.com/examples/Aura-2-janus.wav"></audio> | feminine | Adult | en-us | American | Southern, Smooth, Trustworthy | Storytelling |
| `aura-2-juno-en` | juno | <audio id="juno"  controls src="https://static.deepgram.com/examples/Aura-2-juno.wav"></audio> | feminine | Adult | en-us | American | Natural, Engaging, Melodic, Breathy | Interview |
| `aura-2-jupiter-en` | jupiter | <audio id="jupiter"  controls src="https://static.deepgram.com/examples/Aura-2-jupiter.wav"></audio> | masculine | Adult | en-us | American | Expressive, Knowledgeable, Baritone | Informative |
| `aura-2-luna-en` | luna | <audio id="luna"  controls src="https://static.deepgram.com/examples/Aura-2-luna.wav"></audio> | feminine | Young Adult | en-us | American | Friendly, Natural, Engaging | IVR |
| `aura-2-mars-en` | mars | <audio id="mars"  controls src="https://static.deepgram.com/examples/Aura-2-mars.wav"></audio> | masculine | Adult | en-us | American | Smooth, Patient, Trustworthy, Baritone | Customer service |
| `aura-2-minerva-en` | minerva | <audio id="minerva"  controls src="https://static.deepgram.com/examples/Aura-2-minerva.wav"></audio> | feminine | Adult | en-us | American | Positive, Friendly, Natural | Storytelling |
| `aura-2-neptune-en` | neptune | <audio id="neptune"  controls src="https://static.deepgram.com/examples/Aura-2-neptune.wav"></audio> | masculine | Adult | en-us | American | Professional, Patient, Polite | Customer service |
| `aura-2-odysseus-en` | odysseus | <audio id="odysseus"  controls src="https://static.deepgram.com/examples/Aura-2-odysseus.wav"></audio> | masculine | Adult | en-us | American | Calm, Smooth, Comfortable, Professional | Advertising |
| `aura-2-ophelia-en` | ophelia | <audio id="ophelia"  controls src="https://static.deepgram.com/examples/Aura-2-ophelia.wav"></audio> | feminine | Adult | en-us | American | Expressive, Enthusiastic, Cheerful | Interview |
| `aura-2-orion-en` | orion | <audio id="orion"  controls src="https://static.deepgram.com/examples/Aura-2-orion.wav"></audio> | masculine | Adult | en-us | American | Approachable, Comfortable, Calm, Polite | Informative |
| `aura-2-orpheus-en` | orpheus | <audio id="orpheus"  controls src="https://static.deepgram.com/examples/Aura-2-orpheus.wav"></audio> | masculine | Adult | en-us | American | Professional, Clear, Confident, Trustworthy | Customer service, storytelling |
| `aura-2-pandora-en` | pandora | <audio id="pandora"  controls src="https://static.deepgram.com/examples/Aura-2-pandora.wav"></audio> | feminine | Adult | en-gb | British | Smooth, Calm, Melodic, Breathy | IVR, informative |
| `aura-2-phoebe-en` | phoebe | <audio id="phoebe"  controls src="https://static.deepgram.com/examples/Aura-2-phoebe.wav"></audio> | feminine | Adult | en-us | American | Energetic, Warm, Casual | Customer service |
| `aura-2-pluto-en` | pluto | <audio id="pluto"  controls src="https://static.deepgram.com/examples/Aura-2-pluto.wav"></audio> | masculine | Adult | en-us | American | Smooth, Calm, Empathetic, Baritone | Interview, storytelling |
| `aura-2-saturn-en` | saturn | <audio id="saturn"  controls src="https://static.deepgram.com/examples/Aura-2-saturn.wav"></audio> | masculine | Adult | en-us | American | Knowledgeable, Confident, Baritone | Customer service |
| `aura-2-selene-en` | selene | <audio id="selene"  controls src="https://static.deepgram.com/examples/Aura-2-selene.wav"></audio> | feminine | Adult | en-us | American | Expressive, Engaging, Energetic | Informative |
| `aura-2-thalia-en` | thalia | <audio id="thalia"  controls src="https://static.deepgram.com/examples/Aura-2-thalia.wav"></audio> | feminine | Adult | en-us | American | Clear, Confident, Energetic, Enthusiastic | Casual chat, customer service, IVR |
| `aura-2-theia-en` | theia | <audio id="theia"  controls src="https://static.deepgram.com/examples/Aura-2-theia.wav"></audio> | feminine | Adult | en-au | Australian | Expressive, Polite, Sincere | Informative |
| `aura-2-vesta-en` | vesta | <audio id="vesta"  controls src="https://static.deepgram.com/examples/Aura-2-vesta.wav"></audio> | feminine | Adult | en-us | American | Natural, Expressive, Patient, Empathetic | Customer service, interview, storytelling |
| `aura-2-zeus-en` | zeus | <audio id="zeus"  controls src="https://static.deepgram.com/examples/Aura-2-zeus.wav"></audio> | masculine | Adult | en-us | American | Deep, Trustworthy, Smooth | IVR |

</div>

---

## Aura-2 Spanish Voices (EA)

### Featured Aura-2 Spanish Voices

These are our featured Spanish voices, selected for their versatility and quality:

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-celeste-es` | celeste | <audio id="celeste"  controls src="https://static.deepgram.com/examples/Celeste.wav"></audio> | feminine | Young Adult | es-co | Colombian | Clear, Energetic, Positive, Friendly, Enthusiastic | Casual Chat, Advertising, IVR |
| `aura-2-estrella-es` | estrella | <audio id="estrella"  controls src="https://static.deepgram.com/examples/Estrella.wav"></audio> | feminine | Mature | es-mx | Mexican | Approachable, Natural, Calm, Comfortable, Expressive | Casual Chat, Interview |
| `aura-2-nestor-es` | nestor | <audio id="nestor"  controls src="https://static.deepgram.com/examples/Nestor.wav"></audio> | masculine | Adult | es-es | Peninsular | Calm, Professional, Approachable, Clear, Confident | Casual Chat, Customer Service |

</div>

### Aura-2: All Available Spanish Voices

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-sirio-es` | sirio | <audio id="sirio"  controls src="https://static.deepgram.com/examples/Sirio.wav"></audio> | masculine | Adult | es-mx | Mexican | Calm, Professional, Comfortable, Empathetic, Baritone | Casual Chat, Interview |
| `aura-2-nestor-es` | nestor | <audio id="nestor"  controls src="https://static.deepgram.com/examples/Nestor.wav"></audio> | masculine | Adult | es-es | Peninsular | Calm, Professional, Approachable, Clear, Confident | Casual Chat, Customer Service |
| `aura-2-carina-es` | carina | <audio id="carina"  controls src="https://static.deepgram.com/examples/Carina.wav"></audio> | feminine | Adult | es-es | Peninsular | Professional, Raspy, Energetic, Breathy, Confident | Interview, Customer Service, IVR |
| `aura-2-celeste-es` | celeste | <audio id="celeste"  controls src="https://static.deepgram.com/examples/Celeste.wav"></audio> | feminine | Young Adult | es-co | Colombian | Clear, Energetic, Positive, Friendly, Enthusiastic | Casual Chat, Advertising, IVR |
| `aura-2-alvaro-es` | alvaro | <audio id="alvaro"  controls src="https://static.deepgram.com/examples/Alvaro.wav"></audio> | masculine | Adult | es-es | Peninsular | Calm, Professional, Clear, Knowledgeable, Approachable | Interview, Customer Service |
| `aura-2-diana-es` | diana | <audio id="diana"  controls src="https://static.deepgram.com/examples/Diana.wav"></audio> | feminine | Adult | es-es | Peninsular | Professional, Confident, Expressive, Polite, Knowledgeable | Storytelling, Advertising |
| `aura-2-aquila-es` | aquila | <audio id="aquila"  controls src="https://static.deepgram.com/examples/Aquila.wav"></audio> | masculine | Adult | es-419 | Latin American | Expressive, Enthusiastic, Confident, Casual, Comfortable | Casual Chat, Informative |
| `aura-2-selena-es` | selena | <audio id="selena"  controls src="https://static.deepgram.com/examples/Selena.wav"></audio> | feminine | Young Adult | es-419 | Latin American | Approachable, Casual, Friendly, Calm, Positive | Customer Service, Informative |
| `aura-2-estrella-es` | estrella | <audio id="estrella"  controls src="https://static.deepgram.com/examples/Estrella.wav"></audio> | feminine | Mature | es-mx | Mexican | Approachable, Natural, Calm, Comfortable, Expressive | Casual Chat, Interview |
| `aura-2-javier-es` | javier | <audio id="javier"  controls src="https://static.deepgram.com/examples/Javier.wav"></audio> | masculine | Adult | es-mx | Mexican | Approachable, Professional, Friendly, Comfortable, Calm | Casual Chat, IVR, Storytelling |
| `aura-2-agustina-es` | agustina | <audio id="agustina" controls src="https://static.deepgram.com/examples/Spanish_speaker_725_Agustina.wav"></audio> | feminine | Adult | es-es | Peninsular | Calm, Clear, Expressive, Knowledgeable, Professional | Interview, Casual Chat |
| `aura-2-antonia-es` | antonia | <audio id="antonia" controls src="https://static.deepgram.com/examples/Spanish_speaker_724_Antonia.wav"></audio> | feminine | Adult | es-ar | Argentine | Approachable, Enthusiastic, Friendly, Natural, Professional | Customer Service, Interview, Casual Chat |
| `aura-2-gloria-es` | gloria | <audio id="gloria" controls src="https://static.deepgram.com/examples/Spanish_speaker_671_Gloria.wav"></audio> | feminine | Young Adult | es-co | Colombian | Casual, Clear, Expressive, Natural, Smooth | Customer Service, Casual Chat |
| `aura-2-luciano-es` | luciano | <audio id="luciano" controls src="https://static.deepgram.com/examples/Spanish_speaker_695_Luciano.wav"></audio> | masculine | Adult | es-mx | Mexican | Charismatic, Cheerful, Energetic, Expressive, Friendly | Customer Service, Casual Chat |
| `aura-2-olivia-es` | olivia | <audio id="olivia" controls src="https://static.deepgram.com/examples/Spanish_speaker_750_Olivia.wav"></audio> | feminine | Adult | es-mx | Mexican | Breathy, Calm, Casual, Expressive, Warm | Customer Service, Casual Chat |
| `aura-2-silvia-es` | silvia | <audio id="silvia" controls src="https://static.deepgram.com/examples/Spanish_speaker_737_Silvia.wav"></audio> | feminine | Adult | es-es | Peninsular | Charismatic, Clear, Expressive, Natural, Warm | Customer Service, Casual Chat |
| `aura-2-valerio-es` | valerio | <audio id="valerio" controls src="https://static.deepgram.com/examples/Spanish_speaker_743_Valerio.wav"></audio> | masculine | Adult | es-mx | Mexican | Deep, Knowledgeable, Natural, Polite, Professional | Customer Service, Informative |

</div>

<Info>
  **Codeswitching Voices**: The following Spanish voices can seamlessly switch between English and Spanish: Aquila, Carina, Diana, Javier, and Selena.
</Info>

---

## Aura-2 Dutch Voices

### Featured Aura-2 Dutch Voices

These are our featured Dutch voices, selected for their versatility and quality:

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-rhea-nl` | rhea | <audio id="rhea" controls src="https://static.deepgram.com/examples/Dutch_speaker_731_Rhea.wav"></audio> | feminine | Adult | nl-nl | Dutch | Caring, Knowledgeable, Positive, Smooth, Warm | Customer Service |
| `aura-2-sander-nl` | sander | <audio id="sander" controls src="https://static.deepgram.com/examples/Dutch_speaker_706_Sander.wav"></audio> | masculine | Adult | nl-nl | Dutch | Calm, Clear, Deep, Professional, Smooth | Customer Service |
| `aura-2-beatrix-nl` | beatrix | <audio id="beatrix" controls src="https://static.deepgram.com/examples/Dutch_speaker_761_Beatrix.wav"></audio> | feminine | Adult | nl-nl | Dutch | Cheerful, Enthusiastic, Friendly, Trustworthy, Warm | Customer Service |

</div>

### Aura-2: All Available Dutch Voices

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-beatrix-nl` | beatrix | <audio id="beatrix" controls src="https://static.deepgram.com/examples/Dutch_speaker_761_Beatrix.wav"></audio> | feminine | Adult | nl-nl | Dutch | Cheerful, Enthusiastic, Friendly, Trustworthy, Warm | Customer Service |
| `aura-2-daphne-nl` | daphne | <audio id="daphne" controls src="https://static.deepgram.com/examples/Dutch_speaker_769_Daphne.wav"></audio> | feminine | Adult | nl-nl | Dutch | Calm, Clear, Confident, Professional, Smooth | Healthcare, Interview, Casual Chat, Audiobook |
| `aura-2-cornelia-nl` | cornelia | <audio id="cornelia" controls src="https://static.deepgram.com/examples/Dutch_speaker_686_Cornelia.wav"></audio> | feminine | Adult | nl-nl | Dutch | Approachable, Friendly, Polite, Positive, Warm | Customer Service |
| `aura-2-sander-nl` | sander | <audio id="sander" controls src="https://static.deepgram.com/examples/Dutch_speaker_706_Sander.wav"></audio> | masculine | Adult | nl-nl | Dutch | Calm, Clear, Deep, Professional, Smooth | Customer Service |
| `aura-2-hestia-nl` | hestia | <audio id="hestia" controls src="https://static.deepgram.com/examples/Dutch_speaker_779_Hestia.wav"></audio> | feminine | Adult | nl-nl | Dutch | Approachable, Caring, Expressive, Friendly, Knowledgeable | Customer Service |
| `aura-2-lars-nl` | lars | <audio id="lars" controls src="https://static.deepgram.com/examples/Dutch_speaker_778_Lars.wav"></audio> | masculine | Adult | nl-nl | Dutch | Breathy, Casual, Comfortable, Sincere, Trustworthy | Customer Service |
| `aura-2-roman-nl` | roman | <audio id="roman" controls src="https://static.deepgram.com/examples/Dutch_speaker_708_Roman.wav"></audio> | masculine | Adult | nl-nl | Dutch | Calm, Casual, Deep, Natural, Patient | Customer Service |
| `aura-2-rhea-nl` | rhea | <audio id="rhea" controls src="https://static.deepgram.com/examples/Dutch_speaker_731_Rhea.wav"></audio> | feminine | Adult | nl-nl | Dutch | Caring, Knowledgeable, Positive, Smooth, Warm | Customer Service |
| `aura-2-leda-nl` | leda | <audio id="leda" controls src="https://static.deepgram.com/examples/Dutch_speaker_699_Leda.wav"></audio> | feminine | Adult | nl-nl | Dutch | Caring, Comfortable, Empathetic, Friendly, Sincere | Sales |

</div>

---

## Aura-2 French Voices

### Featured Aura-2 French Voices

These are our featured French voices, selected for their versatility and quality:

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-agathe-fr` | agathe | <audio id="agathe" controls src="https://static.deepgram.com/examples/French_speaker_689_Agathe.wav"></audio> | feminine | Adult | fr-fr | French | Charismatic, Cheerful, Enthusiastic, Friendly, Natural | Customer Service |
| `aura-2-hector-fr` | hector | <audio id="hector" controls src="https://static.deepgram.com/examples/French_speaker_754_Hector.wav"></audio> | masculine | Adult | fr-fr | French | Confident, Empathetic, Expressive, Friendly, Patient | Customer Service |

</div>

### Aura-2: All Available French Voices

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-agathe-fr` | agathe | <audio id="agathe" controls src="https://static.deepgram.com/examples/French_speaker_689_Agathe.wav"></audio> | feminine | Adult | fr-fr | French | Charismatic, Cheerful, Enthusiastic, Friendly, Natural | Customer Service |
| `aura-2-hector-fr` | hector | <audio id="hector" controls src="https://static.deepgram.com/examples/French_speaker_754_Hector.wav"></audio> | masculine | Adult | fr-fr | French | Confident, Empathetic, Expressive, Friendly, Patient | Customer Service |

</div>

---

## Aura-2 German Voices

### Featured Aura-2 German Voices

These are our featured German voices, selected for their versatility and quality:

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-julius-de` | julius | <audio id="julius" controls src="https://static.deepgram.com/examples/German_speaker_723_Julius.wav"></audio> | masculine | Adult | de-de | German | Casual, Cheerful, Engaging, Expressive, Friendly | Customer Service |
| `aura-2-viktoria-de` | viktoria | <audio id="viktoria" controls src="https://static.deepgram.com/examples/German_speaker_705_Viktoria.wav"></audio> | feminine | Adult | de-de | German | Charismatic, Cheerful, Enthusiastic, Friendly, Warm | Customer Service |

</div>

### Aura-2: All Available German Voices

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-elara-de` | elara | <audio id="elara" controls src="https://static.deepgram.com/examples/German_speaker_742_Elara.wav"></audio> | feminine | Adult | de-de | German | Calm, Clear, Natural, Patient, Trustworthy | Healthcare, Customer Service, Sales, Financial Services |
| `aura-2-aurelia-de` | aurelia | <audio id="aurelia" controls src="https://static.deepgram.com/examples/German_speaker_772_Aurelia.wav"></audio> | feminine | Young Adult | de-de | German | Approachable, Casual, Comfortable, Natural, Sincere | Healthcare, Customer Service, Sales, Financial Services |
| `aura-2-lara-de` | lara | <audio id="lara" controls src="https://static.deepgram.com/examples/German_speaker_758_Lara.wav"></audio> | feminine | Young Adult | de-de | German | Caring, Cheerful, Empathetic, Expressive, Warm | Healthcare, Customer Service, Sales, Financial Services |
| `aura-2-julius-de` | julius | <audio id="julius" controls src="https://static.deepgram.com/examples/German_speaker_723_Julius.wav"></audio> | masculine | Adult | de-de | German | Casual, Cheerful, Engaging, Expressive, Friendly | Healthcare, Customer Service, Sales, Financial Services |
| `aura-2-fabian-de` | fabian | <audio id="fabian" controls src="https://static.deepgram.com/examples/German_speaker_751_Fabian.wav"></audio> | masculine | Mature | de-de | German | Confident, Knowledgeable, Natural, Polite, Professional | Healthcare, Customer Service, Sales, Financial Services |
| `aura-2-kara-de` | kara | <audio id="kara" controls src="https://static.deepgram.com/examples/German_speaker_773_Kara.wav"></audio> | feminine | Young Adult | de-de | German | Caring, Empathetic, Expressive, Professional, Warm | Healthcare, Customer Service, Sales, Financial Services |
| `aura-2-viktoria-de` | viktoria | <audio id="viktoria" controls src="https://static.deepgram.com/examples/German_speaker_705_Viktoria.wav"></audio> | feminine | Adult | de-de | German | Charismatic, Cheerful, Enthusiastic, Friendly, Warm | Healthcare, Customer Service, Sales, Financial Services |

</div>

---

## Aura-2 Italian Voices

### Featured Aura-2 Italian Voices

These are our featured Italian voices, selected for their versatility and quality:

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-livia-it` | livia | <audio id="livia" controls src="https://static.deepgram.com/examples/Italian_speaker_721_Livia.wav"></audio> | feminine | Adult | it-it | Italian | Approachable, Cheerful, Clear, Engaging, Expressive | Customer Service |
| `aura-2-dionisio-it` | dionisio | <audio id="dionisio" controls src="https://static.deepgram.com/examples/Italian_speaker_767_Dionisio.wav"></audio> | masculine | Adult | it-it | Italian | Confident, Engaging, Friendly, Melodic, Positive | Sales |

</div>

### Aura-2: All Available Italian Voices

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-melia-it` | melia | <audio id="melia" controls src="https://static.deepgram.com/examples/Italian_speaker_771_Melia.wav"></audio> | feminine | Adult | it-it | Italian | Clear, Comfortable, Engaging, Friendly, Natural | Casual Chat, Customer Service, Interview |
| `aura-2-elio-it` | elio | <audio id="elio" controls src="https://static.deepgram.com/examples/Italian_speaker_736_Elio.wav"></audio> | masculine | Adult | it-it | Italian | Breathy, Calm, Professional, Smooth, Trustworthy | Interview, Casual Chat, Customer Service |
| `aura-2-flavio-it` | flavio | <audio id="flavio" controls src="https://static.deepgram.com/examples/Italian_speaker_709_Flavio.wav"></audio> | masculine | Adult | it-it | Italian | Confident, Deep, Empathetic, Professional, Trustworthy | Casual Chat, Interview, Customer Service |
| `aura-2-maia-it` | maia | <audio id="maia" controls src="https://static.deepgram.com/examples/Italian_speaker_745_Maia.wav"></audio> | feminine | Young Adult | it-it | Italian | Caring, Energetic, Expressive, Professional, Warm | Interview, Casual Chat, Customer Service |
| `aura-2-cinzia-it` | cinzia | <audio id="cinzia" controls src="https://static.deepgram.com/examples/Italian_speaker_763_Cinzia.wav"></audio> | feminine | Mature | it-it | Italian | Approachable, Friendly, Smooth, Trustworthy, Warm | Customer Service, Interview, Narration |
| `aura-2-cesare-it` | cesare | <audio id="cesare" controls src="https://static.deepgram.com/examples/Italian_speaker_770_Cesare.wav"></audio> | masculine | Adult | it-it | Italian | Clear, Empathetic, Knowledgeable, Natural, Smooth | Casual Chat, Customer Service, Interview, IVR |
| `aura-2-livia-it` | livia | <audio id="livia" controls src="https://static.deepgram.com/examples/Italian_speaker_721_Livia.wav"></audio> | feminine | Adult | it-it | Italian | Approachable, Cheerful, Clear, Engaging, Expressive | Customer Service, Interview, Audiobook |
| `aura-2-perseo-it` | perseo | <audio id="perseo" controls src="https://static.deepgram.com/examples/Italian_speaker_735_Perseo.wav"></audio> | masculine | Young Adult | it-it | Italian | Casual, Clear, Natural, Polite, Smooth | Casual Chat, Customer Service |
| `aura-2-dionisio-it` | dionisio | <audio id="dionisio" controls src="https://static.deepgram.com/examples/Italian_speaker_767_Dionisio.wav"></audio> | masculine | Adult | it-it | Italian | Confident, Engaging, Friendly, Melodic, Positive | Interview, Casual Chat, Customer Service |
| `aura-2-demetra-it` | demetra | <audio id="demetra" controls src="https://static.deepgram.com/examples/Italian_speaker_718_Demetra.wav"></audio> | feminine | Adult | it-it | Italian | Calm, Comfortable, Patient | Casual Chat, Interview, Narration |

</div>

---

## Aura-2 Japanese Voices

### Featured Aura-2 Japanese Voices

These are our featured Japanese voices, selected for their versatility and quality:

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-fujin-ja` | fujin | <audio id="fujin" controls src="https://static.deepgram.com/examples/Japanese_speaker_727_Fujin.wav"></audio> | masculine | Adult | ja-jp | Japanese | Calm, Confident, Knowledgeable, Professional, Smooth | Interview, Casual Chat, IVR |
| `aura-2-izanami-ja` | izanami | <audio id="izanami" controls src="https://static.deepgram.com/examples/Japanese_speaker_749_Izanami"></audio> | feminine | Adult | ja-jp | Japanese | Approachable, Clear, Knowledgeable, Polite, Professional | Casual Chat, Customer Service, Interview, IVR |

</div>

## Aura-2: All Available Japanese Voices

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-2-uzume-ja` | uzume | <audio id="uzume" controls src="https://static.deepgram.com/examples/Japanese_speaker_679_Uzume"></audio> | feminine | Young Adult | ja-jp | Japanese | Approachable, Clear, Polite, Professional, Trustworthy | Customer Service, Interview, IVR, Commercial |
| `aura-2-ebisu-ja` | ebisu | <audio id="ebisu" controls src="https://static.deepgram.com/examples/Japanese_speaker_734_Ebisu.wav"></audio> | masculine | Young Adult | ja-jp | Japanese | Calm, Deep, Natural, Patient, Sincere | Casual Chat, Customer Service |
| `aura-2-fujin-ja` | fujin | <audio id="fujin" controls src="https://static.deepgram.com/examples/Japanese_speaker_727_Fujin.wav"></audio> | masculine | Adult | ja-jp | Japanese | Calm, Confident, Knowledgeable, Professional, Smooth | Interview, Casual Chat, IVR |
| `aura-2-izanami-ja` | izanami | <audio id="izanami" controls src="https://static.deepgram.com/examples/Japanese_speaker_749_Izanami"></audio> | feminine | Adult | ja-jp | Japanese | Approachable, Clear, Knowledgeable, Polite, Professional | Casual Chat, Customer Service, Interview, IVR |
| `aura-2-ama-ja` | ama | <audio id="ama" controls src="https://static.deepgram.com/examples/Japanese_speaker_693_Ama.wav"></audio> | feminine | Adult | ja-jp | Japanese | Casual, Comfortable, Confident, Knowledgeable, Natural | Interview, IVR |

</div>

---

## Aura 1: All Available English Voices

<div className="voice-model-table">

| Model | Name | Sample | Expressed Gender | Age | Language | Accent | Characteristics | Use Cases |
| :---- | :--- | :----- | :----- | :-- | :----- | :------- | :------------- | :-------- |
| `aura-asteria-en` | asteria | <audio id="asteria"  controls src="https://res.cloudinary.com/deepgram/video/upload/v1709565353/aura/asteria_docs_venw0r.wav"></audio> | feminine | Adult | en-us | American | Clear, Confident, Knowledgeable, Energetic | Advertising |
| `aura-luna-en` | luna | <audio id="luna"  controls src="https://res.cloudinary.com/deepgram/video/upload/v1709565351/aura/luna_docs_clom0e.wav"></audio> | feminine | Young Adult | en-us | American | Friendly, Natural, Engaging | IVR |
| `aura-stella-en` | stella | <audio id="stella"  controls src="https://res.cloudinary.com/deepgram/video/upload/v1709565349/aura/stella_docs_xh5jbv.wav"></audio> | feminine | Adult | en-us | American | Clear, Professional, Engaging | Customer service |
| `aura-athena-en` | athena | <audio id="athena"  controls src="https://res.cloudinary.com/deepgram/video/upload/v1709565613/aura/athena_docs_wyznud.wav"></audio> | feminine | Mature | en-gb | British | Calm, Smooth, Professional | Storytelling |
| `aura-hera-en` | hera | <audio id="hera"  controls src="https://res.cloudinary.com/deepgram/video/upload/v1709565347/aura/hera_docs_xjkt4x.wav"></audio> | feminine | Adult | en-us | American | Smooth, Warm, Professional | Informative |
| `aura-orion-en` | orion | <audio id="orion"  controls src="https://res.cloudinary.com/deepgram/video/upload/v1709565346/aura/orion_docs_aljv1q.mp3"></audio> | masculine | Adult | en-us | American | Approachable, Comfortable, Calm, Polite | Informative |
| `aura-arcas-en` | arcas | <audio id="arcas"  controls src="https://res.cloudinary.com/deepgram/video/upload/v1709565348/aura/arcas_docs_pc9hxp.mp3"></audio> | masculine | Adult | en-us | American | Natural, Smooth, Clear, Comfortable | Customer service, casual chat |
| `aura-perseus-en` | perseus | <audio id="perseus"  controls src="https://res.cloudinary.com/deepgram/video/upload/v1709565350/aura/perseus_docs_ap7fc0.wav"></audio> | masculine | Adult | en-us | American | Confident, Professional, Clear | Customer service |
| `aura-angus-en` | angus | <audio id="angus"  controls src="https://res.cloudinary.com/deepgram/video/upload/v1709565352/aura/angus_docs_lgse2b.wav"></audio> | masculine | Adult | en-ie | Irish | Warm, Friendly, Natural | Storytelling |
| `aura-orpheus-en` | orpheus | <audio id="orpheus"  controls src="https://res.cloudinary.com/deepgram/video/upload/v1709565350/aura/orpheus_docs_zdlpcf.wav"></audio> | masculine | Adult | en-us | American | Professional, Clear, Confident, Trustworthy | Customer service, storytelling |
| `aura-helios-en` | helios | <audio id="helios"  controls src="https://res.cloudinary.com/deepgram/video/upload/v1709565346/aura/helios_docs_ycjwoo.wav"></audio> | masculine | Adult | en-gb | British | Professional, Clear, Confident | Customer service |
| `aura-zeus-en` | zeus | <audio id="zeus"  controls src="https://res.cloudinary.com/deepgram/video/upload/v1709565347/aura/zeus_docs_fupdiv.wav"></audio> | masculine | Adult | en-us | American | Deep, Trustworthy, Smooth | IVR |

</div>

***


---
title: TTS Voice Controls
subtitle: >-
  Adjust speaking speed and override pronunciation for specific words using
  Aura-2 controls.
slug: docs/tts-voice-controls
---

Aura-2 Controls enable fine-grained adjustments to speech output, allowing you to modify speaking speed and override pronunciation for specific words. These controls are designed for enterprise use cases requiring precise voice quality for industry-specific terminology, brand names, and complex content.

## Availability

| Control | [REST](/reference/text-to-speech/speak) | [WebSocket](/reference/text-to-speech/speak-streaming) | Languages |
|---------|------|-----------|-----------|
| Speed control | Yes | Yes | English (en), Spanish (es) |
| Pronunciation control | Yes | Yes | English (en), Spanish (es) |

## Speed control

Adjust the speaking rate of generated audio. Speed control modifies the pace of speech while maintaining natural prosody and voice quality.

### Parameters

| Parameter | Location | Type | Default | Range | Description |
|-----------|----------|------|---------|-------|-------------|
| `speed` | query | float | `1.0` | `0.7` - `1.5` | Speaking rate multiplier |

<Info>
  For Spanish voices, the recommended speed range is `0.9` - `1.5`. Values below `0.9` may introduce disfluencies.
</Info>

### Example request

```bash
curl --request POST \
     --header "Content-Type: application/json" \
     --header "Authorization: Token DEEPGRAM_API_KEY" \
     --output your_output_file.mp3 \
     --data '{"text":"Hello, how can I help you today?"}' \
     --url "https://api.deepgram.com/v1/speak?model=aura-2-thalia-en&speed=0.9"
```

### Speed values

| Value | Effect | Use Case |
|-------|--------|----------|
| `0.7` | 30% slower | Language learning, accessibility, legal compliance |
| `0.8` | 20% slower | Complex instructions, elderly users |
| `0.9` | 10% slower | Clear explanations, training content |
| `1.0` | Normal speed | Default conversational pace |
| `1.1` | 10% faster | Efficient notifications |
| `1.2` | 20% faster | Quick alerts, time-sensitive content |
| `1.5` | 50% faster | Rapid playback, content preview |

<Info>
  Speed values outside the 0.7x–1.5x range will return an error.
</Info>

## Pronunciation control

Override the default pronunciation of specific words using International Phonetic Alphabet (IPA) notation.

### Syntax

Pronunciation overrides are specified inline within the text using escaped JSON objects:

```text
\{"word": "dupilumab", "pronounce": "duːˈpɪljuːmæb"\}
```

Where:
- `word` is the original text (used for billing and display)
- `pronounce` is the IPA phonetic transcription
- Curly braces must be escaped with backslashes (`\{` and `\}`)

### Example request

```bash
curl -X POST "https://api.deepgram.com/v1/speak?model=aura-2-thalia-en&speed=0.8" \
     -H "Authorization: token DEEPGRAM_API_KEY" \
     -H "Content-Type: application/json" \
     --output your_output_file.mp3 \
     -d '{"text": "Take \\{\"word\": \"Azathioprine\", \"pronounce\": \"æzəˈθaɪəpriːn\"\\} twice daily with \\{\"word\": \"dupilumab\", \"pronounce\": \"duːˈpɪljuːmæb\"\\}."}'
```

<Info>
  The curly braces must be escaped with `\\{` and `\\}` in the cURL command.
</Info>

### Common use cases

| Category | Word | IPA | Spoken As |
|----------|------|-----|-----------|
| Medical | dupilumab | `duːˈpɪljuːmæb` | "doo-PIL-yoo-mab" |
| Medical | azathioprine | `æzəˈθaɪəpriːn` | "az-uh-THIGH-oh-preen" |
| Brand | Hermès | `ɛərˈmɛz` | "air-MEZ" |
| Personal name | Nguyen | `ˈwɪn` | "win" |
| Technical | SQL | `ˈsiːkwəl` | "sequel" |

### Sourcing IPA transcriptions

A few rules of thumb for producing IPA for your own vocabulary:

- **Short lists (&lt;20 words):** generate with an LLM and validate by ear.
- **Longer lists:** use authoritative dictionaries that publish IPA directly:
  - [Cambridge Dictionary](https://dictionary.cambridge.org/)
  - [Collins Dictionary](https://www.collinsdictionary.com/)
  - [Oxford English Dictionary](https://www.oed.com/?tl=true)

**Best practices:**

- **Always validate by ear.** IPA that looks correct on the page can still sound off when synthesized — listen to the output before shipping.
- **Match the dialect.** UK and US pronunciations differ (e.g., *schedule*, *aluminum*). Make sure the IPA you choose matches the voice and audience you're targeting.

### Validation rules

| Rule | Limit |
|------|-------|
| Max pronunciations per request | 500 |
| Max IPA string length | 128 characters |
| IPA length ratio | Cannot exceed 10x the source word length (min floor = 15) |
| Max input text length | 2000 characters |

## Combining controls

Speed and pronunciation controls can be used together in the same request.

### Healthcare example

<CodeGroup>
```python Python
from deepgram import DeepgramClient
from deepgram.core.request_options import RequestOptions

client = DeepgramClient(api_key="YOUR_API_KEY")

# Speed control via request_options
request_opts = RequestOptions(additional_query_parameters={"speed": "0.8"})

# Inline IPA replacements with escaped curly braces
text = r'Take \{"word": "Azathioprine", "pronounce": "æzəˈθaɪəpriːn"\} twice daily with \{"word": "dupilumab", "pronounce": "duːˈpɪljuːmæb"\}.'

response = client.speak.v1.audio.generate(
    text=text,
    model="aura-2-thalia-en",
    encoding="mp3",
    request_options=request_opts
)

audio_bytes = b"".join(response)
with open("medical_instructions.mp3", "wb") as f:
    f.write(audio_bytes)
```

```java Java

DeepgramClient client = DeepgramClient.builder().build();

// Inline IPA replacements with escaped curly braces
String text = "Take \\{\"word\": \"Azathioprine\", \"pronounce\": \"æzəˈθaɪəpriːn\"\\} twice daily with \\{\"word\": \"dupilumab\", \"pronounce\": \"duːˈpɪljuːmæb\"\\}.";

// Speed control via additional query parameters
RequestOptions requestOpts = RequestOptions.builder()
    .additionalQueryParameters(Map.of("speed", "0.8"))
    .build();

InputStream audioStream = client.speak().v1().audio().generate(
    SpeakV1Request.builder()
        .text(text)
        .model("aura-2-thalia-en")
        .encoding("mp3")
        .build(),
    requestOpts
);

try (FileOutputStream fos = new FileOutputStream("medical_instructions.mp3")) {
    audioStream.transferTo(fos);
}
```

```curl cURL
curl -X POST "https://api.deepgram.com/v1/speak?model=aura-2-thalia-en&speed=0.8" \
     -H "Authorization: token DEEPGRAM_API_KEY" \
     -H "Content-Type: application/json" \
     --output medical_instructions.mp3 \
     -d '{"text": "Take \\{\"word\": \"Azathioprine\", \"pronounce\": \"æzəˈθaɪəpriːn\"\\} twice daily with \\{\"word\": \"dupilumab\", \"pronounce\": \"duːˈpɪljuːmæb\"\\}."}'
```
</CodeGroup>

<Info>
  Use raw string (`r'...'`) with escaped braces `\{` and `\}` for pronunciation control in Python.
</Info>

### Brand consistency example

<CodeGroup>
```python Python
from deepgram import DeepgramClient

client = DeepgramClient(api_key="YOUR_API_KEY")

# Ensure consistent brand pronunciation with escaped braces
text = 'Visit \\{"word": "Hermès", "pronounce": "ɛərˈmɛz"\\} for the latest collection.'

response = client.speak.v1.audio.generate(
    text=text,
    model="aura-2-thalia-en",
    encoding="mp3"
)

audio_bytes = b"".join(response)
with open("brand_pronunciation.mp3", "wb") as f:
    f.write(audio_bytes)
```

```java Java

DeepgramClient client = DeepgramClient.builder().build();

// Ensure consistent brand pronunciation with escaped braces
String text = "Visit \\{\"word\": \"Hermès\", \"pronounce\": \"ɛərˈmɛz\"\\} for the latest collection.";

InputStream audioStream = client.speak().v1().audio().generate(
    SpeakV1Request.builder()
        .text(text)
        .model("aura-2-thalia-en")
        .encoding("mp3")
        .build()
);

try (FileOutputStream fos = new FileOutputStream("brand_pronunciation.mp3")) {
    audioStream.transferTo(fos);
}
```
</CodeGroup>

## IPA reference

### Vowels (American English)

| Symbol | Example | As in |
|--------|---------|-------|
| `iː` | /biːt/ | beat |
| `ɪ` | /bɪt/ | bit |
| `eɪ` | /beɪt/ | bait |
| `ɛ` | /bɛt/ | bet |
| `æ` | /bæt/ | bat |
| `ɑː` | /fɑːðər/ | father |
| `ɔː` | /kɔːt/ | caught |
| `oʊ` | /boʊt/ | boat |
| `ʊ` | /pʊt/ | put |
| `uː` | /buːt/ | boot |
| `ʌ` | /kʌt/ | cut |
| `ə` | /əˈbaʊt/ | about |

### Consonants

| Symbol | Example | As in |
|--------|---------|-------|
| `p` | /pɪn/ | pin |
| `b` | /bɪn/ | bin |
| `t` | /tɪn/ | tin |
| `d` | /dɪn/ | din |
| `k` | /kæt/ | cat |
| `ɡ` | /ɡɛt/ | get |
| `f` | /fɪn/ | fin |
| `v` | /væn/ | van |
| `θ` | /θɪŋk/ | think |
| `ð` | /ðæt/ | that |
| `s` | /sɪt/ | sit |
| `z` | /zɪp/ | zip |
| `ʃ` | /ʃɪp/ | ship |
| `ʒ` | /ˈvɪʒən/ | vision |
| `h` | /hæt/ | hat |
| `tʃ` | /tʃɪp/ | chip |
| `dʒ` | /dʒʌmp/ | jump |
| `m` | /mæn/ | man |
| `n` | /nɛt/ | net |
| `ŋ` | /sɪŋ/ | sing |
| `l` | /lɛt/ | let |
| `r` | /rɛd/ | red |
| `w` | /wɪn/ | win |
| `j` | /jɛs/ | yes |

### Stress markers

| Symbol | Meaning | Example |
|--------|---------|---------|
| `ˈ` | Primary stress | /ˈæp.əl/ (apple) |
| `ˌ` | Secondary stress | /ˌɪn.fərˈmeɪ.ʃən/ (information) |

## Billing

| Control | Billing behavior |
|---------|------------------|
| Speed | Not billed - adjusting rate doesn't affect billing |
| Pronunciation | Billed by underlying word - IPA input is not billed |

**Example**: `Hello, \{"word": "Mr.", "pronounce": "ˈmɪstɚ"\} Bond.` is billed as `Hello, Mr. Bond.` (16 characters)

## Response headers

```text
HTTP/1.1 200 OK
content-type: audio/mpeg
dg-request-id: req_xyz789
dg-model-name: aura-2-thalia-en
dg-char-count: 47
dg-pronunciations-applied: 2
dg-speed-used: 0.8
```

| Header | Description |
|--------|-------------|
| `dg-pronunciations-applied` | Number of pronunciation overrides applied |
| `dg-speed-used` | Effective speaking rate used |
| `dg-pronunciation-warnings` | Non-fatal warnings for invalid IPA |

## Error handling

### Speed out of range

```json
{"err_code": "speed_out_of_range", "err_msg": "Speed must be between 0.7 and 1.5"}
```

### Invalid pronunciation

```json
{"err_code": "pronunciation_invalid", "err_msg": "Invalid IPA notation for 'azathioprine'"}
```

## Limits

| Limit | Value |
|-------|-------|
| Max input text length | 2000 characters |
| Speed range | 0.7 - 1.5 |
| Max pronunciations per request | 500 |
| Max IPA string length | 128 characters |


import { DeepgramClient } from '@deepgram/sdk';
import { TRANSCRIPTION_MODEL_ID } from '@/lib/constants';

/**
 * Transcription (Deepgram Nova-3) using official SDK v5
 */
export async function generateCaptions(
  audioUrl: string,
  config: { deepgramKey: string },
  keyterms?: string[]
): Promise<any[]> {
  const { deepgramKey } = config;

  if (!deepgramKey) {
    console.error('[GENERATE_CAPTIONS_ERROR] Deepgram API key is missing');
    return [];
  }

  // Deepgram SDK v5 uses the options object for initialization
  const deepgram = new DeepgramClient({ apiKey: deepgramKey });

  try {
    // Deepgram SDK v5 method path for remote URL transcription.
    // We cast the options object to 'any' to resolve the TypeScript error:
    // "Object literal may only specify known properties, and 'model' does not exist in type 'RequestOptions'".
    const response = await deepgram.listen.v1.media.transcribeUrl({ url: audioUrl }, {
      model: TRANSCRIPTION_MODEL_ID, // nova-3
      smart_format: true,
      punctuate: true,
      keyterm: keyterms,
    } as any);

    // Deepgram SDK v5 returns a union type that might be an 'Accepted' response (for callbacks).
    // Since we are using it synchronously, we cast to 'any' to access the 'results' property safely.
    // We also handle both 'response.results' and 'response.result.results' patterns seen in different v5 sub-versions.
    const res = response as any;
    const results = res.results || res.result?.results;

    return results?.channels[0]?.alternatives[0]?.words || [];
  } catch (error) {
    console.error('[GENERATE_CAPTIONS_ERROR]', error);
    return [];
  }
}


