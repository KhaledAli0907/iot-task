import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import 'package:flutter_app/models/reading_model.dart';

class ReadingCard extends StatelessWidget {
  final ReadingModel reading;
  const ReadingCard({super.key, required this.reading});

  @override
  Widget build(BuildContext context) {
    final ts = reading.createdAt;
    final timeText = ts != null
        ? DateFormat.yMd().add_jms().format(ts.toLocal())
        : '—';

    return Card(
      margin: const EdgeInsets.all(16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              reading.sensor.toUpperCase(),
              style: Theme.of(context).textTheme.labelLarge,
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Text(
                  reading.value.toStringAsFixed(2),
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(width: 8),
                Text('°C', style: Theme.of(context).textTheme.bodyLarge),
              ],
            ),
            const SizedBox(height: 12),
            Text('At: $timeText', style: Theme.of(context).textTheme.bodySmall),
          ],
        ),
      ),
    );
  }
}
