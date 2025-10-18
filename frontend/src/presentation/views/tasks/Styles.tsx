import { StyleSheet } from "react-native";

const TaskFormStyles = StyleSheet.create({
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
    top: '8%',
    alignItems: 'center',
    zIndex: 1,
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  headerTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 8,
    fontWeight: 'bold',
  },
  formContent: {
    width: '100%',
    height: '82%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
  },
  formTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  selectContainer: {
    marginBottom: 20,
  },
  selectLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  optionSelected: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  optionText: {
    fontSize: 12,
    color: '#666',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 20,
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

export default TaskFormStyles;