import * as core from '@actions/core';
import IndexCreator from './Writer/IndexCreator';
import ContentCreator from './Writer/ContentCreator';

const OPEN_AI_API_KEY = core.getInput('open_ai_api_key');
const TITLE = core.getInput('title');

async function main() {
  const indexCreator = new IndexCreator();
  const indexes = await indexCreator.execute(OPEN_AI_API_KEY, TITLE);

  const contentCreator = new ContentCreator();
  const content = await contentCreator.execute(OPEN_AI_API_KEY, TITLE, indexes);
  
  core.setOutput('body', content);
}

main();
