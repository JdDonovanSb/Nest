'use client'
import NavBar from "./components/navbar/Navbar";
import styles from "./page.module.css";

export default function page() {
  return (
    <div className={styles.page}>
      <NavBar />

      <main className={styles.main}>
        {/* Sección Principal */}
        <div className={styles.heroSection}>
          <h1>Bienvenido a la página principal</h1>
          <p className={styles.description}>¡Explora las mejores características de nuestra aplicación!</p>
          <button className={styles.ctaButton}>Comenzar</button>
        </div>


        {/* Sección de Testimonios */}
        <div className={styles.testimonials}>
          <h2>Lo que dicen nuestros usuarios</h2>
          <div className={styles.testimonialCard}>
            <p>"¡Esta aplicación ha revolucionado la forma en que trabajo! ¡Altamente recomendada!"</p>
            <footer>- John Doe, CEO</footer>
          </div>
          <div className={styles.testimonialCard}>
            <p>"¡Un cambio radical para la colaboración en equipo. Súper fácil de usar!"</p>
            <footer>- Jane Smith, Directora de Marketing</footer>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Mi Aplicación. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
