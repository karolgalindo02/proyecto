import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Share,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

import { TopBar } from "../../components/TopBar";
import { AppColors, colorToBg } from "../../theme/AppTheme";
import { CircleProgress } from "../../components/CircleProgress";

import { ProjectRepository } from "../../../data/repositories/ProjectRepository";
import { TaskRepository } from "../../../data/repositories/TaskRepository";
import { Project } from "../../../domain/entities/Project";
import { Task } from "../../../domain/entities/Task";

export const ProjectDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const projectId: number = route.params?.id;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [codeVisible, setCodeVisible] = useState(false);

  const load = useCallback(async () => {
    try {
      const p = await ProjectRepository.getById(projectId);
      setProject(p);

      const t = await TaskRepository.list({ project_id: projectId });
      setTasks(t);
    } catch (e) {
      console.log(e);
    }
  }, [projectId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // 🔗 Compartir
  const shareCode = async () => {
    if (!project) return;
    try {
      await Share.share({
        message: `Únete a mi proyecto "${project.name}" en Takio con el código: ${project.invite_code}`,
      });
    } catch {}
  };

  // 📋 Copiar
  const copyCode = async () => {
    if (!project) return;
    try {
      await Clipboard.setStringAsync(project.invite_code);
      Alert.alert("✅ Copiado", `Código "${project.invite_code}" copiado`);
    } catch {
      Alert.alert("Error", "No se pudo copiar");
    }
  };

  // 🗑️ Eliminar
  const remove = () => {
    if (!project) return;
    Alert.alert(
      "Eliminar proyecto",
      `¿Seguro que deseas eliminar "${project.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await ProjectRepository.remove(project.id);
              navigation.goBack();
            } catch {
              Alert.alert("Error", "No se pudo eliminar");
            }
          },
        },
      ],
    );
  };

  if (!project) {
    return (
      <View style={{ flex: 1, backgroundColor: AppColors.background }}>
        <TopBar back title="Proyecto" />
      </View>
    );
  }

  const c = colorToBg[project.color] || colorToBg.lavender;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const maskedCode = "•".repeat(project.invite_code.length);

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.background }}>
      <TopBar
        back
        title={project.name}
        rightIcon={project.role === "ADMIN" ? "trash-2" : "bell"}
        onRightPress={project.role === "ADMIN" ? remove : undefined}
      />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        {/* HEADER */}
        <View style={[styles.card, { backgroundColor: c.bg }]}>
          <Text style={{ fontWeight: "700", color: c.text, fontSize: 11 }}>
            {project.role}
          </Text>

          <Text style={styles.h1}>{project.name}</Text>

          {!!project.description && (
            <Text style={styles.desc}>{project.description}</Text>
          )}

          <View style={styles.progressRow}>
            <CircleProgress
              value={progress}
              size={60}
              stroke={7}
              color={AppColors.primary}
            />
            <View>
              <Text style={styles.progressText}>
                {done}/{tasks.length} Tareas
              </Text>
              <Text style={styles.progressSub}>Progreso general</Text>
            </View>
          </View>
        </View>

        {/* 🔐 INVITE CODE */}
        <View style={styles.codeCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Código de invitación</Text>

            <Text style={styles.codeText}>
              {codeVisible ? project.invite_code : maskedCode}
            </Text>
          </View>

          {/* 👁️ Ver/Ocultar */}
          <Pressable
            onPress={() => setCodeVisible(!codeVisible)}
            style={styles.iconBtn}
          >
            <Feather
              name={codeVisible ? "eye-off" : "eye"}
              size={18}
              color={AppColors.primary}
            />
          </Pressable>

          {/* 📋 Copiar */}
          <Pressable onPress={copyCode} style={styles.iconBtn}>
            <Feather name="copy" size={18} color={AppColors.primary} />
          </Pressable>

          {/* 🔗 Compartir */}
          <Pressable onPress={shareCode} style={styles.shareBtn}>
            <Feather name="share-2" size={18} color="#FFF" />
          </Pressable>
        </View>

        {/* 👥 MIEMBROS */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Miembros ({project.members?.length || 0})
          </Text>

          <View style={{ gap: 10, marginTop: 10 }}>
            {(project.members || []).map((m) => (
              <View key={m.id} style={styles.memberRow}>
                <View style={styles.avatar}>
                  <Text style={{ color: "#FFF", fontWeight: "700" }}>
                    {m.name?.[0]?.toUpperCase()}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>
                    {m.name} {m.lastname}
                  </Text>
                  <Text style={styles.memberEmail}>{m.email}</Text>
                </View>

                <View
                  style={[
                    styles.rolePill,
                    {
                      backgroundColor:
                        m.role === "ADMIN"
                          ? AppColors.primaryLight
                          : AppColors.green,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        m.role === "ADMIN"
                          ? AppColors.primary
                          : AppColors.greenText,
                      fontWeight: "800",
                      fontSize: 11,
                    }}
                  >
                    {m.role}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 📋 TAREAS */}
        <View style={styles.tasksHeader}>
          <Text style={styles.tasksTitle}>Tareas</Text>

          <Pressable
            style={styles.newTaskBtn}
            onPress={() =>
              navigation.navigate("CreateTask", { project_id: project.id })
            }
          >
            <Feather name="plus" size={14} color="#FFF" />
            <Text style={styles.newTaskText}>Nueva</Text>
          </Pressable>
        </View>

        {tasks.length === 0 ? (
          <Text style={styles.empty}>Sin tareas aún.</Text>
        ) : (
          tasks.map((t) => (
            <Pressable
              key={t.id}
              style={styles.taskCard}
              onPress={() =>
                navigation.navigate("EditTask", { task: t, project })
              }
            >
              <View
                style={[
                  styles.statusBar,
                  {
                    backgroundColor:
                      t.status === "DONE"
                        ? AppColors.green
                        : t.status === "IN_PROGRESS"
                          ? AppColors.peach
                          : AppColors.blue,
                  },
                ]}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle} numberOfLines={1}>
                  {t.title}
                </Text>
                <Text style={styles.taskMeta} numberOfLines={1}>
                  {t.priority} · {t.progress}% · {t.due_date || "sin fecha"}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 16,
    elevation: 2,
  },
  h1: {
    fontSize: 22,
    fontFamily: "LexendDeca-SemiBold",
    color: AppColors.text,
  },
  desc: {
    fontFamily: "LexendDeca",
    color: AppColors.textSecondary,
    marginTop: 6,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 14,
  },
  progressText: {
    fontFamily: "LexendDeca-SemiBold",
    fontSize: 16,
    color: AppColors.text,
  },
  progressSub: { fontFamily: "LexendDeca", color: AppColors.textSecondary },

  label: {
    fontFamily: "LexendDeca-SemiBold",
    fontSize: 11,
    color: AppColors.textSecondary,
    fontWeight: "800",
  },

  codeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 22,
    gap: 8,
  },

  codeText: {
    fontSize: 26,
    fontWeight: "900",
    color: AppColors.primary,
    letterSpacing: 4,
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  memberRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  memberName: { fontFamily: "LexendDeca-SemiBold", color: AppColors.text },
  memberEmail: {
    fontFamily: "LexendDeca",
    color: AppColors.textSecondary,
    fontSize: 12,
  },

  rolePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },

  tasksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tasksTitle: {
    fontSize: 18,
    fontFamily: "LexendDeca-SemiBold",
    color: AppColors.text,
  },

  newTaskBtn: {
    flexDirection: "row",
    backgroundColor: AppColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },
  newTaskText: { color: "#FFF", fontFamily: "LexendDeca-SemiBold" },

  empty: { textAlign: "center", color: AppColors.textSecondary },

  taskCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 16,
    gap: 10,
  },

  statusBar: { width: 10, borderRadius: 4 },
  taskTitle: { fontFamily: "LexendDeca-SemiBold", color: AppColors.text },
  taskMeta: {
    fontFamily: "LexendDeca",
    fontSize: 12,
    color: AppColors.textSecondary,
  },
});
