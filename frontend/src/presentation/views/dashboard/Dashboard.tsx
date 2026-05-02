import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { AppColors, colorToBg } from "../../theme/AppTheme";
import { BottomNav } from "../../components/BottomNav";
import { useUnreadBadge } from "../notifications/NotificationsViewModel";
import { UserRepository } from "../../../data/repositories/UserRepository";
import { useDashboardViewModel } from "../dashboard/DashboardViewModel";
import { CircleProgress } from "../../components/CircleProgress";
import { LinearProgress } from "../../components/LinearProgress";
import { ProjectRepository } from "../../../data/repositories/ProjectRepository";
import { TaskRepository } from "../../../data/repositories/TaskRepository";
import { Project } from "../../../domain/entities/Project";
import { BackgroundBlobs } from "../../components/BackgroundBlobs";

export const DashboardScreen: React.FC<any> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const vm = useDashboardViewModel();
  const badge = useUnreadBadge();

  const load = useCallback(async () => {
    const raw = await AsyncStorage.getItem("takio_user");
    setUser(raw ? JSON.parse(raw) : null);
    try {
      const [s, p] = await Promise.all([
        TaskRepository.dashboardSummary(),
        ProjectRepository.list(),
      ]);
      setSummary(s);
      setProjects(p);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      load();
      vm.reload();
      badge.refresh();
    }, [vm.reload, badge.refresh]),
  );

  const completion = summary?.completion_percent || 0;
  const ringColors = ["#5A45FF", "#FF6B9D", "#FFA552", "#52C9A1"];
  const avatarUrl = UserRepository.resolveImageUrl(vm.user?.image);

  return (
    <View style={{ flex: 1 }}>
      <BackgroundBlobs />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            onPress={() => navigation.navigate("Profile")}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </Text>
              </View>
            )}
            <View>
              <Text style={styles.hello}>Hello!</Text>
              <Text style={styles.userName}>
                {user?.name} {user?.lastname}
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.bellBtn}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Feather name="bell" size={18} color={AppColors.text} />

            {badge.count > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {badge.count > 99 ? "99+" : badge.count}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Hero card */}
        <View style={{ paddingHorizontal: 20 }}>
          <LinearGradient
            colors={["#5A45FF", "#7C64FF", "#9B7FFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
            <View style={{ flex: 1, zIndex: 2 }}>
              <Text style={styles.heroTitle}>
                Tu tarea de hoy{"           "}casi completada!
              </Text>
              <Pressable
                style={styles.viewBtn}
                onPress={() => navigation.navigate("Tasks")}
              >
                <Text style={styles.viewBtnText}>Ver Tareas</Text>
              </Pressable>
            </View>
            <CircleProgress
              value={completion}
              size={96}
              stroke={8}
              color="#FFFFFF"
              trackColor="rgba(255,255,255,0.25)"
              textColor="#FFFFFF"
            />
          </LinearGradient>
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <Pressable
            style={styles.quickCard}
            onPress={() => navigation.navigate("CreateProject")}
          >
            <View
              style={[
                styles.quickIcon,
                { backgroundColor: AppColors.primaryLight },
              ]}
            >
              <Feather name="plus" size={18} color={AppColors.primary} />
            </View>
            <View>
              <Text style={styles.quickTitle}>Nuevo Proyecto</Text>
              <Text style={styles.quickSub}>Ser admin</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.quickCard}
            onPress={() => navigation.navigate("JoinProject")}
          >
            <View
              style={[styles.quickIcon, { backgroundColor: AppColors.pink }]}
            >
              <Feather name="user-plus" size={18} color={AppColors.pinkText} />
            </View>
            <View>
              <Text style={styles.quickTitle}>Unirme</Text>
              <Text style={styles.quickSub}>Con código</Text>
            </View>
          </Pressable>
        </View>

        {/* In Progress horizontal */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>In Progress</Text>
          <Text style={styles.sectionCount}>{projects.length}</Text>
        </View>
        {projects.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={{ color: AppColors.textSecondary }}>
              Aún no tienes proyectos.{" "}
              <Text
                style={{
                  color: AppColors.primary,
                  fontFamily: "LexendDeca-SemiBold",
                }}
                onPress={() => navigation.navigate("CreateProject")}
              >
                Crea uno
              </Text>
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {projects.slice(0, 6).map((p) => {
              const c = colorToBg[p.color] || colorToBg.lavender;
              return (
                <Pressable
                  key={p.id}
                  style={[styles.inProgCard, { backgroundColor: c.bg }]}
                  onPress={() =>
                    navigation.navigate("ProjectDetail", { id: p.id })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.inProgLabel}>
                      {p.role === "ADMIN" ? "Admin Project" : "Member"}
                    </Text>
                    <View style={styles.inProgBadge}>
                      <Feather
                        name="briefcase"
                        size={14}
                        color={AppColors.text}
                      />
                    </View>
                  </View>
                  <Text style={styles.inProgTitle} numberOfLines={2}>
                    {p.name}
                  </Text>
                  <View style={{ marginTop: 18 }}>
                    <LinearProgress
                      value={p.progress || 0}
                      color={AppColors.primary}
                    />
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* Task Groups */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Task Groups</Text>
          <Text style={styles.sectionCount}>{projects.length}</Text>
        </View>
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {projects.map((p, idx) => {
            const c = colorToBg[p.color] || colorToBg.lavender;
            const ring = ringColors[idx % ringColors.length];
            return (
              <Pressable
                key={p.id}
                style={styles.groupRow}
                onPress={() =>
                  navigation.navigate("ProjectDetail", { id: p.id })
                }
              >
                <View style={[styles.groupIcon, { backgroundColor: c.bg }]}>
                  <Feather name="briefcase" size={20} color={AppColors.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.groupTitle} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={styles.groupSub}>
                    {p.tasks_count ?? 0} Tareas · código ••••••
                  </Text>
                </View>
                <CircleProgress
                  value={p.progress || 0}
                  size={48}
                  stroke={5}
                  color={ring}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  avatarText: {
    color: "#FFF",
    fontFamily: "LexendDeca-SemiBold",
    fontSize: 18,
  },
  hello: { color: AppColors.textSecondary, fontFamily: "LexendDeca-Regular" },
  userName: {
    fontFamily: "LexendDeca-SemiBold",
    color: AppColors.text,
    fontSize: 16,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: AppColors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: AppColors.pinkText,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  badgeText: { color: "#FFF", fontSize: 10, fontFamily: "LexendDeca-SemiBold" },
  hero: {
    borderRadius: 28,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: AppColors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  heroCircle1: {
    position: "absolute",
    right: -30,
    bottom: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  heroCircle2: {
    position: "absolute",
    right: -10,
    top: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  heroTitle: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "LexendDeca-SemiBold",
    lineHeight: 26,
  },
  viewBtn: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginTop: 18,
  },
  viewBtnText: { color: AppColors.primary, fontFamily: "LexendDeca-SemiBold" },

  quickRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 16,
  },
  quickCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 14,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickTitle: {
    fontFamily: "LexendDeca-SemiBold",
    color: AppColors.text,
    fontSize: 13,
  },
  quickSub: {
    fontFamily: "LexendDeca-Regular",
    color: AppColors.textSecondary,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: { fontFamily: "LexendDeca-SemiBold", color: AppColors.text },
  sectionCount: {
    color: AppColors.textMuted,
    fontFamily: "LexendDeca-SemiBold",
    marginBottom: 4,
  },

  emptyCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
    shadowColor: AppColors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  inProgCard: {
    width: 180,
    borderRadius: 24,
    padding: 16,
    minHeight: 140,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  inProgLabel: {
    fontSize: 11,
    fontFamily: "LexendDeca-SemiBold",
    letterSpacing: 0.5,
    color: AppColors.text,
    opacity: 0.7,
    textTransform: "uppercase",
  },
  inProgBadge: {
    fontFamily: "LexendDeca-SemiBold",
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  inProgTitle: {
    fontSize: 15,
    fontFamily: "LexendDeca-SemiBold",
    color: AppColors.text,
    marginTop: 10,
    lineHeight: 20,
    minHeight: 40,
  },

  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 14,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  groupTitle: {
    fontFamily: "LexendDeca-SemiBold",
    color: AppColors.text,
    fontSize: 15,
  },
  groupSub: {
    fontFamily: "LexendDeca",
    color: AppColors.textSecondary,
    marginTop: 2,
  },
});
