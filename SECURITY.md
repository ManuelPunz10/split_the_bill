**Do you need to configure CORS for your setup?**
Next.js handhabt serverseitige Anfragen intern, und die Standardkonfiguration befolgt die Same-Origin-Richtlinie automatisch.

**Describe how you configured a CSP for your project.**
CSP in Next.js kontrolliert, welche Ressourcen in der Anwendung geladen und ausgeführt werden dürfen. Dank integrierter Unterstützung lassen sich Sicherheitsheader leicht hinzufügen und Richtlinien anpassen.

**Describe if/how your Database-Layer is vulnerable to SQL Injection and what you need to avoid to be safe.**
Supabase schützt vor SQL-Injection-Angriffen, indem es automatisch Benutzereingaben säubert und escapet.

**Describe if/how your View-Layer is vulnerable to XSS and what you need to avoid to be safe.**
CSP schützt vor XSS, Clickjacking und Code-Injektion, indem es über einen Webheader festlegt, welche Ressourcen geladen und ausgeführt werden dürfen.
