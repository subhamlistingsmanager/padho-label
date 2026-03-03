import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, ScrollView,
    TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';
import { Send, User, Bot, ArrowLeft } from 'lucide-react-native';
import { sendMessageToAI, ChatMessage } from '../services/chatService';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ route, navigation }: Props) {
    const { product } = route.params;
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: `Hi! I'm your Padho Label assistant. I've analyzed **${product.name}**. Ask me anything about its ingredients or health impact!` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const contextString = `
        Product: ${product.name}
        Brand: ${product.brand}
        Nutrition (per 100g): ${JSON.stringify(product.nutrition)}
        Ingredients: ${product.ingredients}
    `;

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        const aiResponse = await sendMessageToAI(userMsg, contextString);
        setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={Colors.textPrimary} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Assistant</Text>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.messageList}
                contentContainerStyle={{ padding: Spacing.md }}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map((msg, i) => (
                    <View
                        key={i}
                        style={[
                            styles.messageRow,
                            msg.role === 'user' ? styles.rowUser : styles.rowBot
                        ]}
                    >
                        {msg.role === 'model' && (
                            <View style={[styles.avatar, { backgroundColor: Colors.primaryLight }]}>
                                <Bot color={Colors.primary} size={16} />
                            </View>
                        )}
                        <View
                            style={[
                                styles.bubble,
                                msg.role === 'user' ? styles.bubbleUser : styles.bubbleBot
                            ]}
                        >
                            <Text style={[
                                styles.messageText,
                                msg.role === 'user' ? styles.textUser : styles.textBot
                            ]}>
                                {msg.text}
                            </Text>
                        </View>
                        {msg.role === 'user' && (
                            <View style={[styles.avatar, { backgroundColor: Colors.chatBubbleUser }]}>
                                <User color="#fff" size={16} />
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your question..."
                    value={input}
                    onChangeText={setInput}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!input.trim() || loading}
                >
                    <Send color="#fff" size={20} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center',
        padding: Spacing.md, backgroundColor: Colors.card,
        ...Shadow.sm, borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    backButton: { marginRight: Spacing.md },
    headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
    messageList: { flex: 1 },
    messageRow: { flexDirection: 'row', marginBottom: Spacing.md, alignItems: 'flex-end' },
    rowBot: { justifyContent: 'flex-start' },
    rowUser: { justifyContent: 'flex-end' },
    avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginHorizontal: Spacing.xs },
    bubble: { maxWidth: '75%', padding: Spacing.md, borderRadius: Radius.lg },
    bubbleBot: { backgroundColor: Colors.chatBubbleBot, borderBottomLeftRadius: 4 },
    bubbleUser: { backgroundColor: Colors.chatBubbleUser, borderBottomRightRadius: 4 },
    messageText: { fontSize: 15, lineHeight: 22 },
    textUser: { color: '#fff' },
    textBot: { color: Colors.textPrimary },
    inputArea: {
        flexDirection: 'row', padding: Spacing.md,
        backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border,
        alignItems: 'flex-end',
    },
    input: {
        flex: 1, backgroundColor: Colors.background,
        borderRadius: Radius.md, paddingHorizontal: Spacing.md,
        paddingTop: 10, paddingBottom: 10, fontSize: 15,
        maxHeight: 100,
    },
    sendButton: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: Colors.primary, marginLeft: Spacing.md,
        alignItems: 'center', justifyContent: 'center',
    },
    sendButtonDisabled: { opacity: 0.5 },
});
