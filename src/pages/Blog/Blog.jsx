import { Link } from 'react-router-dom'
import { blogArticles } from '../../assets/articles/blogArticles'
import './Blog.css'

export default function Blog() {
  return (
    <section className="container">
      <h2>COSS Blog</h2>
      <div className="blog-list">
        {blogArticles.map((article) => (
          <Link
            key={article.slug}
            to={`/resources/blog/${article.slug}`}
            className="blog-preview-card"
          >
            <div className="blog-preview-body">
              <div>
                <h3>{article.title}</h3>
                <p className="blog-preview-author">By {article.author}</p>
              </div>
              <p className="blog-preview-link">Read article &rarr;</p>
            </div>
          </Link>
        ))}
      </div>

      <p>This space is for Cambridge ophthalmology students, by Cambridge ophthalmology students. Have an interesting case, a reflection on a placement, or thoughts on a career in ophthalmology? We'd love to hear from you.</p>

      <div style={{ marginBottom: '2rem' }}>
        <a href="mailto:cambridgeophthsoc@gmail.com" target="_blank" rel="noopener noreferrer" className="cta-link">
          Write for us &rarr;
        </a>
      </div>
    </section>
  )
}
