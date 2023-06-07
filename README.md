```yml
steps:
  - uses: rhea-so-lab/blog-content-generate-action@main
    with:
      open_ai_api_key: ${{ secrets.OPEN_AI_API_KEY }}
      title: 'Lodash 사용법'
```