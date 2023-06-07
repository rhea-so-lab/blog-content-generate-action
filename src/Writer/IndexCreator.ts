const template = `
아래와 같은 사항을 준수해야합니다.
* 당신은 주어진 주제를 바탕으로 책 목차를 만들고 JSON 규격에 맞춰서 응답해야합니다.
* 최소 20개 이상의 목차를 만들어야합니다.
* 질문을 반복해서 말하지 말고 바로 JSON 응답만을 답변해주세요.

응답 규격은 다음과 같습니다.
\`\`\`
["index1", "index2", "indexN"]
\`\`\`

주제는 다음과 같습니다.
{subject}
`;

export default class IndexCreator {
  async execute(OPEN_AI_API_KEY: string, subject: string): Promise<string[]> {
    const { OpenAI } = await import('langchain/llms/openai');

    const model = new OpenAI({
      openAIApiKey: OPEN_AI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 1,
    });

    const result = await model.call(template.replace('{subject}', subject));

    const indexes = JSON.parse(result);

    console.log(` * Subject: ${indexes.join(', ')}`);

    return indexes;
  }
}
