export default function AdminPlaceholder({ title }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
      <div className="text-4xl mb-4">🚧</div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">{title} module coming soon</h2>
      <p className="text-slate-500">This feature is currently under development.</p>
    </div>
  );
}
