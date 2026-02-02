<template>
  <div class="container">
    <header class="header">
      <h1>Rezept Tags</h1>
      <nav>
        <NuxtLink to="/">← Zurück zur Übersicht</NuxtLink>
      </nav>
    </header>

    <main>
      <div v-if="pending">Lädt...</div>
      <div v-else-if="error">Fehler beim Laden der Tags</div>
      <div v-else-if="!data || data.length === 0" class="empty">
        Keine Tags vorhanden. Tags werden automatisch beim Import von Rezepten erstellt.
      </div>
      <div v-else class="tags-grid">
        <div v-for="tag in data" :key="tag.id" class="tag-card">
          {{ tag.name }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { data, pending, error } = await useFetch('/api/tags');
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

.empty {
  padding: 40px;
  text-align: center;
  background: #f5f5f5;
  border-radius: 8px;
  color: #666;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.tag-card {
  background: #e3f2fd;
  color: #1976d2;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 1.1em;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.tag-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
}
</style>
