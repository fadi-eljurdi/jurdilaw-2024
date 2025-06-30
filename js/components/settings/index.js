import utilities from '../../utilities.js'
import store from '../../store.js'
export default {
  template: await utilities.getPage('/js/components/settings/index.html'),
  data() {
    return {
      store,
      utilities,
      colors: {
        primary: '',
        grey: '',
        dark: '',
        light: '',
      },
    }
  },
  methods: {
    saveColors() {
      if (!confirm('Are you sure u want to change the color')) return false

      // Ensure each color value starts with '#'
      const formatColor = (color) => (color.startsWith('#') ? color : `#${color}`)

      const root = document.documentElement
      root.style.setProperty('--j-primary', formatColor(this.colors.primary))
      root.style.setProperty('--j-grey', formatColor(this.colors.grey))
      root.style.setProperty('--j-dark', formatColor(this.colors.dark))
      root.style.setProperty('--j-light', formatColor(this.colors.light))
    },
    initColors() {
      // Get the computed styles of the root element (:root)
      const rootStyles = getComputedStyle(document.documentElement)

      // Read CSS variables and assign them to the colors object
      this.colors.primary = rootStyles.getPropertyValue('--j-primary').trim()
      this.colors.grey = rootStyles.getPropertyValue('--j-grey').trim()
      this.colors.dark = rootStyles.getPropertyValue('--j-dark').trim()
      this.colors.light = rootStyles.getPropertyValue('--j-light').trim()
    },
    updateLogo() {
      // Create an input element for file selection
      if (!confirm('Are you sure u want to change the logo')) return false
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/png, image/jpeg, image/jpg, image/gif'
      input.style.display = 'none'

      input.onchange = (event) => {
        const file = event.target.files[0]
        if (!file) return

        // Check file size (max 1MB)
        if (file.size > 1024 * 1024 * 2) {
          alert('File size must be less than 2MB.')
          return
        }

        // Read file as Data URL (base64)
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target.result
          console.log('Image Data URI:', dataUrl)
          // You can assign dataUrl to a variable or display the image as needed
          this.store.logo = dataUrl
        }
        reader.readAsDataURL(file)
      }

      // Trigger the file input dialog
      document.body.appendChild(input)
      input.click()
      // Remove the input after use
      input.addEventListener('change', () => document.body.removeChild(input))
    },
  },
  mounted() {
    this.initColors()
  },
}
