import React from 'react';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const { NativeCommunicator } = NativeModules;

const App = (props: any) => {

  const [textoNegocio, setTextoNegocio] = useState('Mi Negocio');
  const [mensaje, setMensaje] = useState('');
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (props.nombre) {
      setNombre(props.nombre);
    }
    const obtenerTexto = async () => {
      try {
        const params = new URLSearchParams({
          limit: '-1',
          pais: 'CO',
          modulo: 'PROMPE',
          lenguaje: 'ES',
          canal: '21',
          kind: 'proceso-menuinternoempresas'
        });

        const url = `https://mbaas.lab.co.davivienda.com/catalogo/v1/data/catPROMPE_DATA_MENU010?${params.toString()}`;
        console.log('url:', url);
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].header.title) {
          setTextoNegocio(data[0].header.title);
        }
      } catch (error) {
        console.error('Error al cargar el texto:', error);
        // Puedes dejar el texto por defecto o poner uno de error
        setTextoNegocio('Mi Negocio');
      }
    };

    obtenerTexto();
  }, [props.nombre]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1, // Para que ocupe toda la pantalla
  };

  const manejarPresion = () => {
    const texto = `¡Hola ${nombre}! Gracias por presionar el botón.`;
    setMensaje(texto);

    // Enviar al nativo
    NativeCommunicator.sendBackToNative(texto, (respuesta: string) => {
      console.log('Respuesta del nativo:', respuesta);
    });

    // Cerrar actividad (simular back)
    NativeCommunicator.finishActivity(); // Este método lo crearemos en Java
  };

  const abrirBundleBlue = () => {
    NativeCommunicator.navigateToBundle(
      "blue.bundle",      // nombre del bundle
      "PoCModule",     // nombre del módulo registrado en AppRegistry
      { nombre: nombre }   // props que quieres pasar
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        {/* Header - Pestañas */}
        <View style={styles.headerTabs}>
          <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
            <Text style={styles.tabTextActive}>Mi DaviPlata</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.tabText}>{textoNegocio}</Text>
          </TouchableOpacity>
        </View>

        {/* Sección Productos (icono de nube) */}
        <View style={styles.productsSection}>
          <View style={styles.cloudIconContainer}>
            {/* Aquí iría el icono de la nube */}
            <Text style={styles.cloudIcon}>☁️</Text>
          </View>
          <Text style={styles.productsText}>Productos</Text>
        </View>

        {/* Sección de Saldo */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceQuestion}>¿Cuánto tengo?</Text>
          <Text style={styles.balanceAmount}>$3.300,00</Text>
          <Text style={styles.balanceStatus}>Bienvenido </Text>
          <TouchableOpacity>
            <Text style={styles.verMas}>Ver más</Text>
          </TouchableOpacity>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            {/* Icono de meter plata */}
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Meter plata</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            {/* Icono de pasar plata */}
            <Text style={styles.actionIcon}>↩️</Text>
            <Text style={styles.actionText}>Pasar plata</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            {/* Icono de recargas */}
            <Text style={styles.actionIcon}>📱</Text>
            <Text style={styles.actionText}>Recargas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.moreButton]}>
            {/* Icono de Más */}
            <Text style={styles.moreIcon}>+</Text>
            <Text style={styles.actionText}>Más</Text>
          </TouchableOpacity>
        </View>

        {/* Secciones inferiores - Bolsillo y Tarjeta Virtual */}
        <View style={styles.bottomSectionsContainer}>
          <TouchableOpacity style={styles.bottomSectionButton}>
            <Text style={styles.bottomSectionTitle}>Bolsillo</Text>
            <Text style={styles.bottomSectionIcon}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomSectionButton}>
            <Text style={styles.bottomSectionTitle}>Mi Tarjeta virtual</Text>
            <Text style={styles.bottomSectionAmount}>$0,00</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282828', // Color de fondo oscuro como en la imagen
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center', // Centra horizontalmente los elementos principales
  },
  headerTabs: {
    flexDirection: 'row',
    backgroundColor: '#404040', // Fondo de las pestañas
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    backgroundColor: 'white',
    borderRadius: 20,
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: 'black',
    fontWeight: 'bold',
  },
  productsSection: {
    flexDirection: 'row',
    alignSelf: 'flex-start', // Alineado a la izquierda
    alignItems: 'center',
    marginBottom: 40,
    marginLeft: 10, // Pequeño margen para que no esté pegado al borde
  },
  cloudIconContainer: {
    backgroundColor: '#404040',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cloudIcon: {
    fontSize: 24,
    color: 'white',
  },
  productsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceSection: {
    backgroundColor: '#404040', // Fondo para el círculo, se simula con un View redondo
    borderRadius: 100, // Para que sea circular
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderColor: '#606060', // Borde sutil
    borderWidth: 1,
  },
  balanceQuestion: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 5,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  balanceStatus: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 10,
  },
  verMas: {
    color: '#FF6347', // Color naranja similar al de la imagen
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  actionIcon: {
    fontSize: 24,
    color: 'white',
    marginBottom: 5,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
  },
  moreButton: {
    backgroundColor: '#FF6347', // Color naranja para el botón "Más"
  },
  moreIcon: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 2, // Ajuste para el centrado visual
  },
  bottomSectionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  bottomSectionButton: {
    backgroundColor: '#404040',
    borderRadius: 70,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  bottomSectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bottomSectionIcon: {
    fontSize: 30,
    color: '#FF6347', // Color naranja para el signo de más
    fontWeight: 'bold',
  },
  bottomSectionAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;