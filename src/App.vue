
<style scoped>


body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  position: relative;
}

@media (max-width: 768px) and (orientation: portrait) {
  .logo {
    margin: 0;
  }
  .top-line {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin: 0;
  }
  .logo {
    order: 1;
    flex: 0 0 auto;
  }
  .date-group {
    order: 2;
    display: flex;
    gap: 4px;
    width: 100%;
    padding-left: 0;
  }
  .select-date {
    flex: 0 0 auto;
    padding: 0 4px;
  }
  .date-display {
    flex: 1 1 auto;
    min-width: 0;
  }
  .row-group {
    order: 3;
    display: flex;
    align-items: center;
    width: 100%;
    gap: 8px;
  }
  .export-button,
  .export-dropdown {
    flex: 0 0 auto;
  }
  .sign-in,
  .sign-out {
    flex: 0 0 auto;
    margin-left: auto;
  }
}
</style>

<style>
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  position: relative;
  background-color: rgb(20, 20,20);
      
}

</style>
