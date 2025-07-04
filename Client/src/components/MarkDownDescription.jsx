
export default function StepDescription({ description }) {
  return (
    <div className="prose">
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  )
}
