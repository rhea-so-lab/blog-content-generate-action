const template = `
아래와 같은 사항을 준수해야합니다.
* 당신은 주어진 주제와 제목을 바탕으로 책 내용을 보강해야합니다.
* 질문을 반복해서 말하지 말고 바로 응답만을 답변해주세요.
* 존댓말을 사용해주세요.
* 주제를 말하지마세요.
* 제목을 말하지마세요.
* 가능한 많은 내용을 서술하세요.

주제는 다음과 같습니다.
{subject}

제목은 다음과 같습니다.
{index}
`;

export default class ContentCreator {
  async execute(OPEN_AI_API_KEY: string, subject: string, indexes: string[]): Promise<string> {
    const items = Array.from({ length: indexes.length });

    const { OpenAI } = await import('langchain/llms/openai');

    const model = new OpenAI({
      openAIApiKey: OPEN_AI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 1,
    });

    await Promise.all(
      indexes.map(async (index, position) => {
        const startTime = Date.now();
        items[position] = `## ${index}\n\n` + (await model.call(template.replace('{subject}', subject).replace('{index}', index))) + '\n\n';
        console.log(` * ${index} 작성 완료 (${(Date.now() - startTime).toLocaleString()}ms 소요)`);
      }),
    );

    return items.join('\n');
  }
}
