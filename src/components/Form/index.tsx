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
import { theme } from '../../theme'
import { styles } from './styles'
import { FeedbackType } from '../Widget'
import { feedbackTypes } from '../../utils/feedbackTypes'
import { ScreenshotButton } from '../ScreenshotButton'
import { Button } from '../Button'

interface Props {
  feedbackType: FeedbackType;
}

export function Form({feedbackType}: Props) {
  const feedbackTypeInfo = feedbackTypes[feedbackType];
  const [ screenshot, setScreenshot ] = useState<string | null>(null);

  const handleTakeScreenshot = () => {
    captureScreen({
      format: 'png',
      quality: .8,
    })
    .then(uri => setScreenshot(uri))
    .catch(error => console.log(error))
  }

  const handleRemoveScreenshot = () => setScreenshot(null);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
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
      />
      <View style={styles.footer}>
        <ScreenshotButton
          screenshot={screenshot}
          onScreenshotTaken={handleTakeScreenshot}
          onRemoveShot={handleRemoveScreenshot}
        />
        <Button 
          isLoading={true}
        />
      </View>
    </View>
  )
}