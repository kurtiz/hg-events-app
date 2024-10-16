import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:high_gang_events/src/features/authentication/screens/welcome/welcome_screen.dart';
import 'package:high_gang_events/src/utils/theme/app_theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.system,
      home: const WelcomeScreen(),
    );
  }
}
