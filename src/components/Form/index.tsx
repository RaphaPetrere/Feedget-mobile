import React, { useState } from 'react'
import { 
  View, 
  Text,
  TextInput, 
  Image,
  TouchableOpacity,
} from 'react-native'
import { captureScreen } from 'react-native-view-shot';
import { ArrowLeft } from 'phosphor-react-native'
import * as FileSystem from 'expo-file-system';
import { styles } from './styles'
import { FeedbackType } from '../Widget'
import { Button } from '../Button'
import { ScreenshotButton } from '../ScreenshotButton'
import { theme } from '../../theme'
import { feedbackTypes } from '../../utils/feedbackTypes'
import { api } from '../../libs/api';

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

export function Form({
  feedbackType,
  onFeedbackCanceled,
  onFeedbackSent
}: Props) {
  const feedbackTypeInfo = feedbackTypes[feedbackType];
  const [ screenshot, setScreenshot ] = useState<string | null>(null);
  const [ isSendingFeedback, setIsSendingFeedback ] = useState(false);
  const [ comment, setComment ] = useState('');

  const handleTakeScreenshot = () => {
    captureScreen({
      format: 'png',
      quality: .8,
    })
    .then(uri => setScreenshot(uri))
    .catch(error => console.log(error))
  }

  const handleRemoveScreenshot = () => setScreenshot(null);

  const handleSendFeedback = async () => {
    if(isSendingFeedback)
      return;

    setIsSendingFeedback(true);
    const screenshotBase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, {
      encoding: 'base64'
    })
    try {
      await api.post('/feedbacks', {
        type: feedbackType,
        screenshot: `data:image/png;base64, ${screenshotBase64}`,
        comment,
      });
      onFeedbackSent();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled} >
          <ArrowLeft 
            size={24}
            weight='bold'
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image 
            source={feedbackTypeInfo.image}
            style={styles.image}
          />
          <Text style={styles.titleText}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>

      <TextInput 
        multiline
        style={styles.input}
        placeholder="Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo..."
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      />
      <View style={styles.footer}>
        <ScreenshotButton
          screenshot={screenshot}
          onScreenshotTaken={handleTakeScreenshot}
          onRemoveShot={handleRemoveScreenshot}
        />
        <Button 
          isLoading={isSendingFeedback}
          onPress={handleSendFeedback}
        />
      </View>
    </View>
  )
}