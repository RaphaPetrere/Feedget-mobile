import React, { useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { ChatTeardropDots } from 'phosphor-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import { styles } from './styles'
import { theme } from '../../theme';
import { Options } from '../Options';
import { Form } from '../Form';
import { feedbackTypes } from '../../utils/feedbackTypes';
import { Success } from '../Success';

export type FeedbackType = keyof typeof feedbackTypes;

function Widget() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleOpenBottomSheet = () => bottomSheetRef.current?.expand();
  const handleRestartFeedback = () => {
    setFeedbackSent(false);
    setFeedbackType(null);
  }
  return (
    <>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleOpenBottomSheet}
      >
        <ChatTeardropDots 
          size={24}
          color={theme.colors.text_on_brand_color}
          weight="bold"
        />
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[1, 280]}
        backgroundStyle={styles.modal}
        handleIndicatorStyle={styles.indicator}
      >
        {
          feedbackSent
          ?
          <Success 
            onSendAnotherFeedback={handleRestartFeedback}
          />
          :
          (
            feedbackType
            ?
            <Form 
              feedbackType={feedbackType} 
              onFeedbackCanceled={handleRestartFeedback}
              onFeedbackSent={() => setFeedbackSent(true)}
            />
            :
            <Options onFeedbackTypeChanged={setFeedbackType} />
          )
        }
      </BottomSheet>
    </>
  )
}

export default gestureHandlerRootHOC(Widget);