import { useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { useJokes } from "../context/JokesContext";

function formatCount(n) {
    if (n === 1) return "1 piada";
    return `${n} piadas`;
}

export default function SavedScreen() {
    const { savedJokes, deleteJoke, toggleFavorite } = useJokes();
    const [showEnglishForId, setShowEnglishForId] = useState(null);

    const headerText = useMemo(
        () => formatCount(savedJokes.length),
        [savedJokes.length],
    );

    function handleDelete(id) {
        Alert.alert("Excluir", "Remover esta piada das salvas?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: () => deleteJoke(id),
            },
        ]);
    }

    return (
        <LinearGradient
            colors={["#0B1020", "#101B3A", "#0B1020"]}
            style={styles.page}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Salvas</Text>
                <View style={styles.subRow}>
                    <Text style={styles.subtitle}>{headerText}</Text>
                    <View style={styles.dot} />
                    <Text style={styles.subtitleMuted}>
                        toque para ver o original
                    </Text>
                </View>
            </View>

            {savedJokes.length === 0 ? (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                        <Ionicons name="bookmark" size={20} color="#0B1020" />
                    </View>
                    <Text style={styles.emptyTitle}>Nada salvo ainda</Text>
                    <Text style={styles.emptyText}>
                        Quando você salvar uma piada, ela aparece aqui.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={savedJokes}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => (
                        <View style={styles.separator} />
                    )}
                    renderItem={({ item }) => {
                        const showingEnglish = showEnglishForId === item.id;
                        const favorite = !!item.isFavorite;

                        return (
                            <Pressable
                                onPress={() =>
                                    setShowEnglishForId((prev) =>
                                        prev === item.id ? null : item.id,
                                    )
                                }
                                style={({ pressed }) => [
                                    styles.card,
                                    pressed ? styles.pressed : null,
                                ]}
                            >
                                <View style={styles.cardTopRow}>
                                    <View style={styles.cardBadge}>
                                        <Ionicons
                                            name="bookmark"
                                            size={14}
                                            color="#0B1020"
                                        />
                                        <Text style={styles.cardBadgeText}>
                                            Salva
                                        </Text>
                                    </View>

                                    <View style={styles.cardActions}>
                                        <Pressable
                                            onPress={() =>
                                                toggleFavorite(item.id)
                                            }
                                            hitSlop={10}
                                            style={({ pressed }) => [
                                                styles.starButton,
                                                pressed
                                                    ? styles.starPressed
                                                    : null,
                                            ]}
                                        >
                                            <Ionicons
                                                name={
                                                    favorite
                                                        ? "star"
                                                        : "star-outline"
                                                }
                                                size={18}
                                                color={
                                                    favorite
                                                        ? "#FFD54A"
                                                        : "rgba(232, 236, 255, 0.55)"
                                                }
                                            />
                                        </Pressable>

                                        <Pressable
                                            onPress={() =>
                                                handleDelete(item.id)
                                            }
                                            hitSlop={10}
                                            style={({ pressed }) => [
                                                styles.trashButton,
                                                pressed
                                                    ? styles.trashPressed
                                                    : null,
                                            ]}
                                        >
                                            <Ionicons
                                                name="trash"
                                                size={18}
                                                color="#FFB4B4"
                                            />
                                        </Pressable>
                                    </View>
                                </View>

                                <Text style={styles.jokeText}>
                                    {item.translatedText}
                                </Text>

                                {showingEnglish ? (
                                    <View style={styles.englishBox}>
                                        <Text style={styles.englishLabel}>
                                            Original (EN)
                                        </Text>
                                        <Text style={styles.englishText}>
                                            {item.englishText}
                                        </Text>
                                    </View>
                                ) : null}
                            </Pressable>
                        );
                    }}
                />
            )}
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
        marginTop: 18,
        marginBottom: 14,
    },
    title: {
        color: "#E8ECFF",
        fontSize: 28,
        fontWeight: "800",
        letterSpacing: 0.2,
    },
    subRow: {
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    subtitle: {
        color: "rgba(232, 236, 255, 0.70)",
        fontWeight: "700",
    },
    subtitleMuted: {
        color: "rgba(232, 236, 255, 0.55)",
        fontWeight: "600",
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "rgba(232, 236, 255, 0.30)",
    },
    listContent: {
        paddingBottom: 10,
    },
    separator: {
        height: 10,
    },
    card: {
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
        marginBottom: 10,
    },
    cardBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#B9C2FF",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    cardBadgeText: {
        color: "#0B1020",
        fontWeight: "900",
        fontSize: 12,
    },
    cardActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    starButton: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(185, 194, 255, 0.08)",
        borderColor: "rgba(185, 194, 255, 0.22)",
        borderWidth: 1,
    },
    starPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    trashButton: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 180, 180, 0.08)",
        borderColor: "rgba(255, 180, 180, 0.22)",
        borderWidth: 1,
    },
    trashPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    jokeText: {
        color: "#E8ECFF",
        fontSize: 17,
        lineHeight: 25,
        fontWeight: "700",
    },
    englishBox: {
        marginTop: 12,
        paddingTop: 12,
        borderTopColor: "rgba(185, 194, 255, 0.14)",
        borderTopWidth: 1,
    },
    englishLabel: {
        color: "rgba(232, 236, 255, 0.70)",
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 6,
    },
    englishText: {
        color: "rgba(232, 236, 255, 0.65)",
        fontSize: 13,
        lineHeight: 18,
    },
    pressed: {
        opacity: 0.92,
        transform: [{ scale: 0.99 }],
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 22,
    },
    emptyIcon: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: "#B9C2FF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    emptyTitle: {
        color: "#E8ECFF",
        fontSize: 18,
        fontWeight: "900",
        marginBottom: 6,
    },
    emptyText: {
        color: "rgba(232, 236, 255, 0.60)",
        textAlign: "center",
        lineHeight: 20,
    },
});
