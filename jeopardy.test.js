describe("Test getCategoryIds + getCategory ", function () {
  it("should return an array of 6 category ids and titles", async function () {
    const cats = await getCategoryIds();
    expect(cats.length).toEqual(6);
    for (let obj of cats) {
      expect(obj.id).toBeDefined();
      expect(obj.title).toBeDefined();
    }
  })
it("should return an array of 5 questions and a title", async function(){
  const cats = await getCategoryIds();
  const results = await getCategory(cats);
  for(let i=0; i<results.length; i++){if((results[i].clues.length == 5)){validQuestions = true;}else {validQuestions = false;}}
  for(let i=0; i<results.length; i++){if(results[i].title !== undefined){validTitle = true;}else {validTitle = false;}}

expect(validQuestions).toEqual(true);
expect(validTitle).toEqual(true);
expect(categories.length).toEqual(6);
expect(categories[0].clues.length).toEqual(5);
})
});
