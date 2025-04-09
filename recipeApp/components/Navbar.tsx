import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '../components/ThemeContext' // Hook mit Info aus aktuellem design theme
import { Ionicons } from '@expo/vector-icons'



type Page = 'home' | 'new' | 'my' | 'search'

type Props = {
  currentPage: Page
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>> //React.Dispatch<...> sagt setCurrentPage (Funktion) die Argumente (home, new, my...) entgegennimmt und Statusänderung (anzeige seite) ausgelöst 
}

export default function BottomNavBar({currentPage,setCurrentPage}:Props){
  const { isDarkMode, theme } = useTheme()

  const navItems: { icon: string; label: string; page: Page }[] = [ //nav item array mit den einzelnen bestandteilen
    { icon: 'home', label: 'Home', page: 'home' },
    { icon: 'add', label: 'New Recipe', page: 'new' },
    { icon: 'list', label: 'My Recipe', page: 'my' },
    { icon: 'search', label: 'Search Recipe', page: 'search' },
  ]
  

  return (
    <View style={[styles.container,{
      backgroundColor: isDarkMode ? theme.colors.black : theme.colors.white,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
    }]}>
      {navItems.map(item=>(
        <TouchableOpacity // Komponente wird für jedes Navigationselement verwendet. wenn klick dannsetCurrentPage aufgerufen um  aktuelle Seite zu ändern
          key={item.page}
          onPress={()=>setCurrentPage(item.page)}
          style={styles.navItem}
        >
          <View style={[
            styles.indicator,
            currentPage===item.page && {
              backgroundColor: theme.colors.blue
            }
          ]} />
          <Ionicons
            name={item.icon as any}
            size={24}
            color={currentPage===item.page ? theme.colors.blue : theme.colors.grey}
          />
          <Text style={{
            color: currentPage===item.page ? theme.colors.blue : theme.colors.grey,
            fontWeight: currentPage===item.page ? '600' : '400'
          }}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    justifyContent:'space-around',
    paddingTop:0,
    marginTop:0,
    paddingBottom:20,
  },
  navItem:{
    alignItems:'center',
  },
  indicator:{
    width:30,
    height:5,
    borderRadius:5,
    marginBottom:10,
  }
})
