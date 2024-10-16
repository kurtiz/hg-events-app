import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:high_gang_events/src/features/authentication/screens/sign_up/widgets/sign_up_form.dart';
import 'package:high_gang_events/src/features/authentication/screens/sign_up/widgets/sign_up_form_footer.dart';

class SignUpScreen extends StatelessWidget {
  const SignUpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;

    return SafeArea(
      child: Scaffold(
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Theme.of(context).brightness == Brightness.light
                    ? Image.asset(
                        "assets/images/logo.png",
                        height: height * 0.25,
                      )
                    : Image.asset(
                        "assets/images/logo-white.png",
                        height: height * 0.25,
                      ),
                Text(
                  "Get Started",
                  style: GoogleFonts.poppins(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                Text(
                  "Sign up to explore High Gang Events",
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                const SizedBox(
                  height: 24,
                ),
                const SignUpForm(),
                const SizedBox(height: 16),
                const SignUpFormFooter(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
