import ResourceCard from '../../components/ResourceCard/ResourceCard'

export default function Resources() {
  return (
    <section className="resources container">
      <h2>Resources</h2>
      <p>Useful documents, reading lists, teaching materials and curated pages.</p>

      <div className="resources-grid">
        <ResourceCard
          to="/resources/blog"
          title="COSS Blog"
          description="News and articles from the society, ordered by date."
          image="https://images.unsplash.com/photo-1508830524289-0adcbe822b40?w=1200&q=60"
        />

        <ResourceCard
          to="/resources/diseases"
          title="Diseases of the Week"
          description="Short weekly articles on common eye conditions."
          image="https://images.unsplash.com/photo-1582719478146-7f2b2f30f0c8?w=1200&q=60"
        />

        <ResourceCard
          to="/resources/osce"
          title="OSCE Resources"
          description="PDF checklists, station guides and practice materials."
          image="https://images.unsplash.com/photo-1581091870622-3e6f4bde6f0f?w=1200&q=60"
        />

        <ResourceCard
          to="/resources/duke-elder"
          title="Duke Elder Resources"
          description="Selected Duke Elder highlights with the daily quiz on the side."
          image="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=1200&q=60"
          badge="Classic"
        />

        <ResourceCard
          to="/resources/eyesi"
          title="Eyesi"
          description="Submit short observations and access community submissions."
          image="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=60"
        />
      </div>
    </section>
  )
}
