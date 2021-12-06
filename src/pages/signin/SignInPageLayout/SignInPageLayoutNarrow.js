import React from 'react';
import {ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {withSafeAreaInsets} from 'react-native-safe-area-context';
import styles from '../../../styles/styles';
import * as StyleUtils from '../../../styles/StyleUtils';
import variables from '../../../styles/variables';
import ExpensifyCashLogo from '../../../components/ExpensifyCashLogo';
import ExpensifyText from '../../../components/ExpensifyText';
import TermsAndLicenses from '../TermsAndLicenses';
import withLocalize, {withLocalizePropTypes} from '../../../components/withLocalize';
import Form from '../../../components/Form';
import compose from '../../../libs/compose';
import scrollViewContentContainerStyles from './signInPageStyles.js';
import LoginKeyboardAvoidingView from './LoginKeyboardAvoidingView';
import withKeyboardState from '../../../components/withKeyboardState';

const propTypes = {
    /** The children to show inside the layout */
    children: PropTypes.node.isRequired,

    /** Welcome text to show in the header of the form, changes depending
     * on form type (set password, sign in, etc.) */
    welcomeText: PropTypes.string.isRequired,

    /** Whether to show welcome text on a particular page */
    shouldShowWelcomeText: PropTypes.bool.isRequired,

    /** SafeArea insets */
    insets: PropTypes.shape(PropTypes.object),

    ...withLocalizePropTypes,
};

const defaultProps = {
    insets: {},
};

const SignInPageLayoutNarrow = props => (
    <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={[
            styles.h100,
            styles.alignSelfCenter,
        ]}
        contentContainerStyle={scrollViewContentContainerStyles}
    >
        <Form style={[styles.flex1, styles.signInPageNarrowContentContainer, styles.alignSelfStretch, styles.ph5]}>
            <LoginKeyboardAvoidingView
                behavior="position"
                contentContainerStyle={[
                    styles.mt40Percentage,
                    styles.mb3,
                    StyleUtils.getModalPaddingStyles({
                        shouldAddBottomSafeAreaPadding: true,
                        modalContainerStylePaddingBottom: 20,
                        safeAreaPaddingBottom: props.insets.bottom,
                    }),
                ]}
            >
                <View style={[styles.componentHeightLarge, styles.mb2]}>
                    <ExpensifyCashLogo
                        width={variables.componentSizeLarge}
                        height={variables.componentSizeLarge}
                    />
                </View>
                {props.shouldShowWelcomeText && (
                    <ExpensifyText style={[styles.mv5, styles.textLabel, styles.h3]}>
                        {props.welcomeText}
                    </ExpensifyText>
                )}
                {props.children}
            </LoginKeyboardAvoidingView>
        </Form>
        <View style={[styles.mb5, styles.alignSelfCenter, styles.signInPageNarrowContentContainer, styles.ph5]}>
            <TermsAndLicenses />
        </View>
    </ScrollView>
);

SignInPageLayoutNarrow.propTypes = propTypes;
SignInPageLayoutNarrow.defaultProps = defaultProps;
SignInPageLayoutNarrow.displayName = 'SignInPageLayoutNarrow';

export default compose(
    withLocalize,
    withKeyboardState,
    withSafeAreaInsets,
)(SignInPageLayoutNarrow);
