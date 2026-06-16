import { Database, Terminal } from "lucide-react";

export function DatabaseSetup() {
  return (
    <div className="page narrow-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Setup required</p>
          <h1>Connect your database</h1>
          <p>The app is running correctly, but it needs a PostgreSQL database before it can load application data.</p>
        </div>
      </header>
      <section className="panel setup-panel">
        <Database size={28} />
        <div>
          <h2>Add your Neon connection string</h2>
          <p>Create a <code>.env</code> file in the project root using the format below.</p>
          <pre>DATABASE_URL=&quot;postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require&quot;</pre>
        </div>
      </section>
      <section className="panel setup-panel">
        <Terminal size={28} />
        <div>
          <h2>Prepare the database</h2>
          <p>After adding the connection string, restart the development server and run:</p>
          <pre>npm run db:push{"\n"}npm run db:seed{"\n"}npm run dev</pre>
        </div>
      </section>
    </div>
  );
}
