export function getPublishedPosts(postList) {
  return [...postList]
    .filter((post) => post.status === "published")
    .sort((firstPost, secondPost) => new Date(secondPost.date) - new Date(firstPost.date));
}

export function getPostBySlug(postList, slug) {
  return postList.find((post) => post.slug === slug);
}

export function getCategoriesWithCounts(postList) {
  const counts = postList.reduce((accumulator, post) => {
    accumulator[post.category] = (accumulator[post.category] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((firstCategory, secondCategory) => firstCategory.name.localeCompare(secondCategory.name));
}
