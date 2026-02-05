import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { Api } from "../services/api";
import { useJokes } from "../context/JokesContext";

export default function HomeScreen() {
    const api = useMemo(() => new Api(), []);
    const { isSaved, saveJoke, deleteJoke } = useJokes();

    const [englishJoke, setEnglishJoke] = useState("");
    const [translatedJoke, setTranslatedJoke] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState("");

    const canSave =
        translatedJoke.trim().length > 0 && englishJoke.trim().length > 0;
    const saved = canSave ? isSaved(englishJoke) : false;

    async function handleGetJoke() {
        setLoading(true);
        setErrorText("");
        setEnglishJoke("");
        setTranslatedJoke("");

        try {
            const joke = await api.getChuckJoke();
            const translated = await api.translateWithAI(joke);

            if (translated.includes("a piada era demais para o horário")) {
                setTranslatedJoke("A piada era demais para o horário.");
                setEnglishJoke("The joke was too adult-themed.");
            } else {
                setEnglishJoke(joke);
                setTranslatedJoke(translated);
            }
            
        } catch (err) {
            console.error(err);
            setErrorText("Não foi possível buscar/ traduzir a piada.");
        } finally {
            setLoading(false);
        }
    }

    function handleToggleSave() {
        if (!canSave) return;

        if (saved) {
            deleteJoke(englishJoke);
            return;
        }

        saveJoke({ englishText: englishJoke, translatedText: translatedJoke });
    }

    return (
        <LinearGradient
            colors={["#0B1020", "#101B3A", "#0B1020"]}
            style={styles.page}
        >
            <View style={styles.header}>
                <View style={styles.badge}>
                    <Ionicons name="skull" size={16} color="#E8ECFF" />
                    <Text style={styles.badgeText}>Chuck Norris</Text>
                </View>

                <Text style={styles.title}>Piadas traduzidas</Text>
                <Text style={styles.subtitle}>
                    Busque uma piada aleatória e salve as melhores.
                </Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardTopRow}>
                    <Text style={styles.cardTitle}>Resultado</Text>
                    {saved ? (
                        <View style={styles.savedPill}>
                            <Ionicons
                                name="bookmark"
                                size={14}
                                color="#0B1020"
                            />
                            <Text style={styles.savedPillText}>Salva</Text>
                        </View>
                    ) : null}
                </View>

                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator color="#B9C2FF" size="large" />
                        <Text style={styles.loadingText}>
                            Traduzindo com IA…
                        </Text>
                    </View>
                ) : errorText ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="warning" size={18} color="#FFB4B4" />
                        <Text style={styles.errorText}>{errorText}</Text>
                    </View>
                ) : translatedJoke ? (
                    <Text style={styles.jokeText}>{translatedJoke}</Text>
                ) : (
                    <Text style={styles.placeholder}>
                        Toque em “Nova piada” para começar.
                    </Text>
                )}

                {!!englishJoke && !loading ? (
                    <View style={styles.metaBox}>
                        <Text style={styles.metaLabel}>Original (EN)</Text>
                        <Text style={styles.metaText} numberOfLines={3}>
                            {englishJoke}
                        </Text>
                    </View>
                ) : null}
            </View>

            <View style={styles.actionsRow}>
                <Pressable
                    onPress={handleGetJoke}
                    disabled={loading}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && !loading ? styles.pressed : null,
                        loading ? styles.disabled : null,
                    ]}
                >
                    <Ionicons name="sparkles" size={18} color="#0B1020" />
                    <Text style={styles.primaryButtonText}>Nova piada</Text>
                </Pressable>

                <Pressable
                    onPress={handleToggleSave}
                    disabled={!canSave || loading}
                    style={({ pressed }) => [
                        styles.secondaryButton,
                        pressed && canSave && !loading ? styles.pressed : null,
                        !canSave || loading ? styles.disabled : null,
                    ]}
                >
                    <Ionicons
                        name={saved ? "trash" : "bookmark"}
                        size={18}
                        color="#E8ECFF"
                    />
                    <Text style={styles.secondaryButtonText}>
                        {saved ? "Excluir" : "Salvar"}
                    </Text>
                </Pressable>
            </View>

            <Text style={styles.footnote}>
                Dica: as piadas salvas aparecem na aba “Salvas”.
            </Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 14,
    },
    header: {
        marginTop: 8,
        marginBottom: 14,
    },
    badge: {
        alignSelf: "flex-start",
        backgroundColor: "rgba(232, 236, 255, 0.10)",
        borderColor: "rgba(232, 236, 255, 0.18)",
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    badgeText: {
        color: "#E8ECFF",
        fontWeight: "700",
        letterSpacing: 0.2,
    },
    title: {
        color: "#E8ECFF",
        fontSize: 28,
        fontWeight: "800",
        letterSpacing: 0.2,
    },
    subtitle: {
        marginTop: 6,
        color: "rgba(232, 236, 255, 0.72)",
        fontSize: 14,
        lineHeight: 20,
    },
    card: {
        flex: 1,
        backgroundColor: "rgba(16, 27, 58, 0.72)",
        borderColor: "rgba(185, 194, 255, 0.18)",
        borderWidth: 1,
        borderRadius: 18,
        padding: 16,
    },
    cardTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    cardTitle: {
        color: "rgba(232, 236, 255, 0.85)",
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 0.6,
        textTransform: "uppercase",
    },
    savedPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#B9C2FF",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    savedPillText: {
        color: "#0B1020",
        fontWeight: "800",
        fontSize: 12,
    },
    placeholder: {
        color: "rgba(232, 236, 255, 0.55)",
        fontSize: 16,
        lineHeight: 24,
    },
    jokeText: {
        color: "#E8ECFF",
        fontSize: 18,
        lineHeight: 26,
        fontWeight: "700",
    },
    metaBox: {
        marginTop: 14,
        paddingTop: 14,
        borderTopColor: "rgba(185, 194, 255, 0.14)",
        borderTopWidth: 1,
    },
    metaLabel: {
        color: "rgba(232, 236, 255, 0.70)",
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 6,
    },
    metaText: {
        color: "rgba(232, 236, 255, 0.65)",
        fontSize: 13,
        lineHeight: 18,
    },
    loadingBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        paddingVertical: 10,
    },
    loadingText: {
        color: "rgba(232, 236, 255, 0.70)",
        fontWeight: "600",
    },
    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "rgba(255, 180, 180, 0.08)",
        borderColor: "rgba(255, 180, 180, 0.22)",
        borderWidth: 1,
        padding: 12,
        borderRadius: 14,
    },
    errorText: {
        color: "rgba(255, 220, 220, 0.95)",
        flex: 1,
        lineHeight: 18,
        fontWeight: "600",
    },
    actionsRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 14,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: "#B9C2FF",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
    },
    primaryButtonText: {
        color: "#0B1020",
        fontWeight: "900",
        letterSpacing: 0.2,
    },
    secondaryButton: {
        width: 132,
        backgroundColor: "rgba(232, 236, 255, 0.10)",
        borderColor: "rgba(232, 236, 255, 0.16)",
        borderWidth: 1,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
    },
    secondaryButtonText: {
        color: "#E8ECFF",
        fontWeight: "800",
    },
    pressed: {
        transform: [{ scale: 0.99 }],
        opacity: 0.92,
    },
    disabled: {
        opacity: 0.55,
    },
    footnote: {
        marginTop: 10,
        color: "rgba(232, 236, 255, 0.50)",
        fontSize: 12,
        textAlign: "center",
    },
});
