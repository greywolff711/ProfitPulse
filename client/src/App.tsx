import { createTheme, ThemeProvider } from "@mui/material/styles"
import { useMemo } from "react"
import { themeSettings } from "./assets/theme"
import { Box, CssBaseline } from "@mui/material"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import NavBar from "./scenes/navbar/index"
import Dashboard from "./scenes/dashboard"
import Predictions from "./scenes/predictions"

function App() {
  const theme = useMemo(() => createTheme(themeSettings), [])
  return <div className='app'>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        
        <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
          <NavBar/>
          <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/predictions" element={<Predictions/>} />
          </Routes>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
    </ThemeProvider>
  </div>
}

export default App
