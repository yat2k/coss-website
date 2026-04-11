import ResourceCard from '../../components/ResourceCard/ResourceCard'
import blogImg from '../../assets/undraw_blogging_38kl.svg'
import diseaseImg from '../../assets/disease-of-the-week.png'
import osceImg from '../../assets/osce-resources.png'
import dukeElderImg from '../../assets/duke-elder-exam-prep.png'
import eyesiImg from '../../assets/eyeSi.png'

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
          image={blogImg}
        />

        <ResourceCard
          to="/resources/diseases"
          title="Diseases of the Week"
          description="Short weekly articles on common eye conditions."
          image={diseaseImg}
        />

        <ResourceCard
          to="/resources/osce"
          title="OSCE Resources"
          description="PDF checklists, station guides and practice materials."
          image={osceImg}
        />

        <ResourceCard
          to="/resources/duke-elder"
          title="Duke Elder Resources"
          description="Selected Duke Elder highlights with the daily quiz on the side."
          image={dukeElderImg}
        />

        <ResourceCard
          to="/resources/eyesi"
          title="Eyesi"
          description="Submit short observations and access community submissions."
          image={eyesiImg}
        />
      </div>
    </section>
  )
}
