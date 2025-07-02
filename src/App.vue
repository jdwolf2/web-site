<script>
export default {
  name: "App",
  data() {
    return {
      width: 0,
      height: 0
    };
  },
  computed: {
    isLandscape() {
      return this.width > this.height;
    }
  },
  mounted() {
    window.addEventListener("resize", this.updateWindowSize);
    this.updateWindowSize();
    console.log("Mounted - dimensions:", window.innerWidth, window.innerHeight);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateWindowSize);
  },
  methods: {
    updateWindowSize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      console.log("Updated size:", this.width, this.height);
    }
  }
};
</script>
