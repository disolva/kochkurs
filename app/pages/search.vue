<template>
  <div class="container">
    <header class="header">
      <h1>Rezept Suche</h1>
      <nav>
        <NuxtLink to="/">← Zurück zur Übersicht</NuxtLink>
      </nav>
    </header>

    <main>
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rezept suchen..."
          @input="onSearch"
        />
      </div>

      <div v-if="pending">Suche läuft...</div>
      <div v-else-if="data && data.length > 0" class="recipes-grid">
        <div v-for="recipe in data" :key="recipe.id" class="recipe-card">
          <h3>
            <NuxtLink :to="`/recipes/${recipe.id}`">{{ recipe.title }}</NuxtLink>
          </h3>
          <p v-if="recipe.description" class="description">{{ recipe.description }}</p>
          <div class="meta">
            <span v-if="recipe.prepTime">⏱️ {{ recipe.prepTime }} Min</span>
            <span v-if="recipe.cookTime">🔥 {{ recipe.cookTime }} Min</span>
          </div>
        </div>
      </div>
      <div v-else-if="searchQuery" class="empty">
        Keine Rezepte gefunden für "{{ searchQuery }}"
      </div>
      <div v-else class="empty">
        Gib einen Suchbegriff ein, um Rezepte zu finden.
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('');
let timeout: NodeJS.Timeout;

const { data, pending, refresh } = await useFetch('/api/search', {
  query: { q: searchQuery },
  immediate: false,
});

const onSearch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      refresh();
    }
  }, 300);
};
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

nav a {
  text-decoration: none;
  color: #0066cc;
  font-weight: 500;
}

nav a:hover {
  text-decoration: underline;
}

.search-box {
  margin-bottom: 30px;
}

.search-box input {
  width: 100%;
  padding: 15px;
  font-size: 1.1em;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
}

.search-box input:focus {
  border-color: #0066cc;
}

.empty {
  padding: 40px;
  text-align: center;
  background: #f5f5f5;
  border-radius: 8px;
  color: #666;
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
  gap: 15px;
  margin-top: 15px;
  font-size: 0.9em;
  color: #777;
}
</style>
