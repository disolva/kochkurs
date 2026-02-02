<template>
  <div class="container">
    <header class="header">
      <h1>Rezept Details</h1>
      <nav>
        <NuxtLink to="/">← Zurück zur Übersicht</NuxtLink>
      </nav>
    </header>

    <main>
      <div v-if="pending">Lädt...</div>
      <div v-else-if="error">Rezept nicht gefunden</div>
      <div v-else-if="data" class="recipe-detail">
        <h2>{{ data.title }}</h2>
        
        <div v-if="data.description" class="description">
          <p>{{ data.description }}</p>
        </div>

        <div class="meta">
          <span v-if="data.prepTime">⏱️ Vorbereitung: {{ data.prepTime }} Min</span>
          <span v-if="data.cookTime">🔥 Koch-Zeit: {{ data.cookTime }} Min</span>
          <span v-if="data.servings">👥 Portionen: {{ data.servings }}</span>
        </div>

        <div v-if="data.tags && data.tags.length > 0" class="tags">
          <strong>Tags:</strong>
          <span v-for="tag in data.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
        </div>

        <div v-if="data.ingredients && data.ingredients.length > 0" class="section">
          <h3>Zutaten</h3>
          <ul class="ingredients">
            <li v-for="ingredient in data.ingredients" :key="ingredient.id">
              <span v-if="ingredient.quantity">{{ ingredient.quantity }}</span>
              <span v-if="ingredient.unit">{{ ingredient.unit }}</span>
              {{ ingredient.name }}
            </li>
          </ul>
        </div>

        <div class="section">
          <h3>Zubereitung</h3>
          <div class="instructions">{{ data.instructions }}</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { data, pending, error } = await useFetch(`/api/recipes/${route.params.id}`);
</script>

<style scoped>
.container {
  max-width: 800px;
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

.recipe-detail h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 2em;
}

.description {
  margin: 20px 0;
  padding: 15px;
  background: #f9f9f9;
  border-left: 4px solid #0066cc;
  line-height: 1.6;
}

.meta {
  display: flex;
  gap: 20px;
  margin: 20px 0;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 0.95em;
}

.tags {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9em;
}

.section {
  margin: 30px 0;
}

.section h3 {
  margin: 0 0 15px 0;
  color: #444;
  font-size: 1.5em;
}

.ingredients {
  list-style: none;
  padding: 0;
}

.ingredients li {
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.ingredients li:last-child {
  border-bottom: none;
}

.instructions {
  line-height: 1.8;
  white-space: pre-wrap;
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
}
</style>
