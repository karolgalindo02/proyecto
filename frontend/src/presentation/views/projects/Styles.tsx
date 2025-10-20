import { StyleSheet } from "react-native";

const ProjectFormStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
    position: 'absolute',
  },
  headerContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '10%',
    alignItems: 'center',
    zIndex: 1,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  headerTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
    marginTop: 8,
    fontWeight: 'bold',
  },
  formContent: {
    width: '100%',
    height: '75%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
  },
  formTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 30,
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF6B00',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProjectFormStyles;