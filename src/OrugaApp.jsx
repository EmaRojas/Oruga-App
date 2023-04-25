import { OrugaRoutes } from "./oruga/routes/OrugaRoutes"
import { AppRouter } from "./router/AppRouter"
import { AppTheme } from "./theme"

export const OrugaApp = () => {
  return (
    <AppTheme>
        <AppRouter/>
    </AppTheme>
  )
}
