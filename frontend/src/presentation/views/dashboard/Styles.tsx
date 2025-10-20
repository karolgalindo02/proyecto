import { StyleSheet } from "react-native";

const DashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
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
  welcomeText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 5,
    opacity: 0.9,
  },
  dashboardContent: {
    width: '100%',
    height: '75%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 15,
    minWidth: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#FF6B00', // Naranja similar al home
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 10,
  },
  projectCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  projectStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusInProgress: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusCompleted: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  projectTeam: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    minWidth: 35,
  },
  taskCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  priorityHigh: {
    borderLeftColor: '#dc3545',
  },
  priorityMedium: {
    borderLeftColor: '#ffc107',
  },
  priorityLow: {
    borderLeftColor: '#28a745',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  taskPriority: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
  },
    buttonSpacing: {
    marginTop: 30,
  },
  taskDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  dueDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  taskProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskProgressText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  activityItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  urgentActivity: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  activityText: {
    fontSize: 14,
    color: '#333',
  },
  urgentText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '600',
  },
});

export default DashboardStyles;