import { Link, useParams } from 'react-router-dom'
import { blogArticles } from '../../assets/articles/blogArticles'
import './Blog.css'

export default function BlogArticle() {
  const { slug } = useParams()
  const article = blogArticles.find((entry) => entry.slug === slug)

  if (!article) {
    return (
      <section className="container">
        <h2>Article not found</h2>
        <p>Sorry, we couldn't find that blog post.</p>
        <p><Link to="/resources/blog">Back to blog</Link></p>
      </section>
    )
  }

  return (
    <article className="container blog-article-page">
      <p className="blog-back-link">
        <Link to="/resources/blog">&larr; Back to blog</Link>
      </p>
      <h2>{article.title}</h2>
      <p className="blog-article-meta">
        By {article.author} | {article.date}
      </p>
      <div
        className="card blog-article-card"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  )
}
