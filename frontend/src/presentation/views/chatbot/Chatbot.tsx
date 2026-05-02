import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { TopBar } from "../../components/TopBar";
import { AppColors } from "../../theme/AppTheme";
import { BottomNav } from "../../components/BottomNav";
import { ChatbotRepository } from "../../../data/repositories/ChatRepository";
import {
  ChatMessage,
  ProjectStructure,
} from "../../../domain/entities/ChatMessage";
import { formatApiError } from "../../../data/sources/remote/api/ApiDelivery";
import { BackgroundBlobs } from "../../components/BackgroundBlobs";
// --- COMPONENTE AUXILIAR PARA RENDERIZAR MARKDOWN (NEGRITAS) ---
const MarkdownText = ({ content, style }: { content: string; style?: any }) => {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return (
    <Text style={style}>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text
              key={index}
              style={{ fontFamily: "LexendDeca-Bold", fontWeight: "bold" }}
            >
              {part.slice(2, -2)}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

type Mode = "welcome" | "chat" | "structure";

const CATEGORIES: Array<{
  id: string;
  label: string;
  prompt: string;
  bg: string;
  fg: string;
}> = [
  {
    id: "project",
    label: "Proyecto",
    prompt: "Quiero diseñar un proyecto de",
    bg: AppColors.pink,
    fg: AppColors.pinkText,
  },
  {
    id: "task",
    label: "Tarea",
    prompt: "Ayúdame con la tarea de",
    bg: AppColors.lavender,
    fg: AppColors.primary,
  },
  {
    id: "calendar",
    label: "Calendario",
    prompt: "Organiza mi calendario para",
    bg: AppColors.blue,
    fg: AppColors.blueText,
  },
];

const SUGGESTIONS = [
  {
    title: "Crear un proyecto",
    hint: "Crea 5 tareas funcionales para iniciar un proyecto de marketing",
  },
  {
    title: "Plan de sprint",
    hint: "Diseña un sprint de 2 semanas para app de ventas",
  },
  {
    title: "Tareas de estudio",
    hint: "Organiza mis tareas para un proyecto universitario de ingeniería",
  },
];

export const ChatbotScreen: React.FC<any> = ({ navigation }) => {
  const [mode, setMode] = useState<Mode>("welcome");
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<number | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("Usuario");
  const [structure, setStructure] = useState<ProjectStructure | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  React.useEffect(() => {
    AsyncStorage.getItem("takio_user").then((raw) => {
      if (raw) setUserName(JSON.parse(raw).name || "Usuario");
    });
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  };

  const send = useCallback(
    async (text: string) => {
      const msg = text.trim();
      if (!msg) return;
      setMode("chat");
      setMessages((prev) => [...prev, { role: "user", content: msg }]);
      scrollToBottom();
      setInput("");
      setLoading(true);

      try {
        const { reply, session_id } = await ChatbotRepository.sendMessage(
          msg,
          sessionId,
        );
        setSessionId(session_id);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        scrollToBottom();
      } catch (err) {
        Alert.alert("Error", formatApiError(err));
      } finally {
        setLoading(false);
      }
    },
    [sessionId],
  );

  const generate = useCallback(async () => {
    const msg = input.trim();
    if (msg.length < 5) return Alert.alert("Describe mejor tu idea");
    setLoading(true);
    try {
      const result = await ChatbotRepository.generateProject(msg, false);
      setStructure(result.structure);
      setMode("structure");
    } catch (err) {
      Alert.alert("Error", formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, [input]);

  const confirmCreate = useCallback(async () => {
    if (!structure) return;
    setLoading(true);
    try {
      const result = await ChatbotRepository.generateProject(
        input.trim() || structure.project_name,
        true,
      );
      if (result.created && result.project) {
        Alert.alert(
          "🎉 Proyecto creado por IA",
          `"${result.project.name}"\n${result.tasks?.length || 0} tareas · código ${result.project.invite_code}`,
          [
            {
              text: "Ver proyecto",
              onPress: () =>
                navigation.replace("ProjectDetail", { id: result.project!.id }),
            },
          ],
        );
      }
    } catch (err) {
      Alert.alert("Error", formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, [structure, input, navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: AppColors.background }}
    >
      <BackgroundBlobs />
      <TopBar back title="Chatbot Takio" />

      {mode === "welcome" && (
        <ScrollView
          contentContainerStyle={{
            padding: 24,
            alignItems: "center",
            paddingBottom: 180,
          }}
        >
          <Image
            source={require("../../../../assets/ChatBc.png")}
            style={{ width: 300, height: 130, marginBottom: -24 }}
            resizeMode="contain"
          />

          <Text style={styles.greet}>
            ¡Hola, {userName}! Estoy Listo Para Ayudarte
          </Text>
          <Text style={styles.sub}>
            Realiza una propuesta de proyecto. {"                          "}
            ¡Estoy aquí para ayudar!
          </Text>

          <View style={{ width: "100%", gap: 10, marginTop: 20 }}>
            {SUGGESTIONS.map((s, idx) => (
              <Pressable
                key={idx}
                style={styles.suggest}
                onPress={() => setInput(s.hint)}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    backgroundColor: AppColors.pink,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="zap" size={16} color={AppColors.pinkText} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "LexendDeca-SemiBold",
                      color: AppColors.text,
                    }}
                  >
                    {s.title}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      color: AppColors.textSecondary,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {s.hint}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {mode === "chat" && (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 16, paddingBottom: 180 }}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((m, i) => (
            <View
              key={i}
              style={[
                styles.bubble,
                m.role === "user" ? styles.userBubble : styles.botBubble,
              ]}
            >
              <MarkdownText
                content={m.content}
                style={{
                  color: m.role === "user" ? "#FFF" : AppColors.text,
                  lineHeight: 22,
                  fontFamily: "LexendDeca",
                }}
              />
            </View>
          ))}
          {loading && (
            <View
              style={[
                styles.bubble,
                styles.botBubble,
                { flexDirection: "row", alignItems: "center", gap: 8 },
              ]}
            >
              <ActivityIndicator size="small" color={AppColors.primary} />
              <Text
                style={{
                  color: AppColors.textSecondary,
                  fontFamily: "LexendDeca",
                }}
              >
                Takio AI está escribiendo...
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {mode === "structure" && structure && (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 180, gap: 12 }}
        >
          <View style={styles.resultCard}>
            <Text
              style={{
                fontFamily: "LexendDeca-SemiBold",
                fontSize: 20,
                color: AppColors.text,
              }}
            >
              {structure.project_name}
            </Text>
            <Text
              style={{
                color: AppColors.textSecondary,
                marginTop: 6,
                fontFamily: "LexendDeca",
              }}
            >
              {structure.description}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "LexendDeca-SemiBold",
              color: AppColors.text,
              marginTop: 8,
            }}
          >
            Tareas sugeridas ({structure.tasks.length})
          </Text>
          {structure.tasks.map((t, idx) => (
            <View key={idx} style={styles.taskItem}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: AppColors.primaryLight,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: AppColors.primary,
                    fontFamily: "LexendDeca-SemiBold",
                    fontSize: 12,
                  }}
                >
                  {idx + 1}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "LexendDeca-SemiBold",
                    color: AppColors.text,
                  }}
                >
                  {t.title}
                </Text>
                {!!t.description && (
                  <Text
                    style={{
                      color: AppColors.textSecondary,
                      fontSize: 12,
                      marginTop: 2,
                      fontFamily: "LexendDeca",
                    }}
                  >
                    {t.description}
                  </Text>
                )}
              </View>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor:
                    t.priority === "HIGH"
                      ? AppColors.pink
                      : t.priority === "LOW"
                        ? AppColors.green
                        : AppColors.lavender,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "LexendDeca-SemiBold",
                    color:
                      t.priority === "HIGH"
                        ? AppColors.pinkText
                        : t.priority === "LOW"
                          ? AppColors.greenText
                          : AppColors.primary,
                  }}
                >
                  {t.priority || "MEDIUM"}
                </Text>
              </View>
            </View>
          ))}
          <Pressable
            style={[styles.confirmBtn, loading && { opacity: 0.6 }]}
            onPress={confirmCreate}
            disabled={loading}
          >
            <Feather name="check" size={18} color="#FFF" />
            <Text style={styles.confirmText}>
              {loading ? "Creando..." : "Crear proyecto + tareas"}
            </Text>
          </Pressable>
          <Pressable onPress={() => setMode("welcome")}>
            <Text
              style={{
                textAlign: "center",
                color: AppColors.textSecondary,
                marginTop: 6,
                fontFamily: "LexendDeca",
              }}
            >
              Descartar propuesta
            </Text>
          </Pressable>
        </ScrollView>
      )}

      <View style={styles.inputBar}>
        <View style={styles.chipsRow}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setInput(c.prompt + " ")}
              style={[styles.chip, { backgroundColor: c.bg }]}
            >
              <Text
                style={{
                  color: c.fg,
                  fontFamily: "LexendDeca-SemiBold",
                  fontSize: 12,
                }}
              >
                {c.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.row}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Diseña un proyecto..."
            placeholderTextColor={AppColors.textMuted}
            style={styles.input}
            multiline
          />
          <Pressable
            style={[styles.sendBtn, { backgroundColor: AppColors.primary }]}
            onPress={() => (input.trim() ? send(input) : null)}
            onLongPress={generate}
            delayLongPress={300}
          >
            <Feather name="send" size={20} color="#FFF" />
          </Pressable>
        </View>
        <Pressable
          onPress={generate}
          style={{ alignSelf: "center", marginTop: 4 }}
        >
          <Text
            style={{
              color: AppColors.primary,
              fontFamily: "LexendDeca-SemiBold",
              fontSize: 12,
            }}
          >
            ✨ Generar proyecto completo con IA
          </Text>
        </Pressable>
      </View>

      <BottomNav />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  blob: {
    width: 240,
    height: 200,
    borderRadius: 120,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  starWrap: { alignItems: "center", justifyContent: "center" },
  floatingTag: { position: "absolute", width: 22, height: 22, borderRadius: 8 },
  greet: {
    fontSize: 26,
    fontFamily: "LexendDeca-SemiBold",
    color: AppColors.text,
    textAlign: "center",
    marginTop: 24,
    lineHeight: 34,
  },
  sub: {
    color: AppColors.textSecondary,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
    fontFamily: "LexendDeca",
  },
  suggest: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  bubble: { padding: 14, borderRadius: 18, marginVertical: 4, maxWidth: "86%" },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: AppColors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 4,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  resultCard: {
    backgroundColor: AppColors.primaryLight,
    borderRadius: 20,
    padding: 18,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  confirmBtn: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.primary,
    paddingVertical: 16,
    borderRadius: 999,
    marginTop: 8,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 14,
  },
  confirmText: {
    color: "#FFF",
    fontFamily: "LexendDeca-SemiBold",
    fontSize: 15,
  },
  inputBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 90,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chipsRow: { flexDirection: "row", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF",
    borderRadius: 999,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: AppColors.text,
    maxHeight: 80,
    paddingVertical: 10,
    fontFamily: "LexendDeca",
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: AppColors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
