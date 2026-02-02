<template>
  <div class="container">
    <header class="header">
      <h1>Kochkurs - Rezepte</h1>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/search">Suche</NuxtLink>
        <NuxtLink to="/tags">Tags</NuxtLink>
      </nav>
    </header>

    <main>
      <h2>Alle Rezepte</h2>
      
      <div v-if="pending">Lädt...</div>
      <div v-else-if="error">Fehler beim Laden der Rezepte</div>
      <div v-else-if="!data || data.length === 0" class="empty">
        <p>Keine Rezepte gefunden.</p>
        <p>Importiere Rezepte mit: <code>npm run import &lt;pfad-zu-rezept-json&gt;</code></p>
      </div>
      <div v-else class="recipes-grid">
        <div v-for="recipe in data" :key="recipe.id" class="recipe-card">
          <h3>
            <NuxtLink :to="`/recipes/${recipe.id}`">{{ recipe.title }}</NuxtLink>
          </h3>
          <p v-if="recipe.description" class="description">{{ recipe.description }}</p>
          <div class="meta">
            <span v-if="recipe.prepTime">⏱️ Vorbereitung: {{ recipe.prepTime }} Min</span>
            <span v-if="recipe.cookTime">🔥 Koch-Zeit: {{ recipe.cookTime }} Min</span>
            <span v-if="recipe.servings">👥 Portionen: {{ recipe.servings }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { data, pending, error } = await useFetch('/api/recipes');
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.header h1 {
  margin: 0 0 15px 0;
  color: #333;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  text-decoration: none;
  color: #0066cc;
  font-weight: 500;
}

nav a:hover {
  text-decoration: underline;
}

main h2 {
  margin-bottom: 20px;
  color: #444;
}

.empty {
  padding: 40px;
  text-align: center;
  background: #f5f5f5;
  border-radius: 8px;
}

.empty code {
  background: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.recipe-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  transition: box-shadow 0.2s;
}

.recipe-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recipe-card h3 {
  margin: 0 0 10px 0;
}

.recipe-card h3 a {
  text-decoration: none;
  color: #333;
}

.recipe-card h3 a:hover {
  color: #0066cc;
}

.description {
  color: #666;
  margin: 10px 0;
  line-height: 1.5;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 15px;
  font-size: 0.9em;
  color: #777;
}
</style>
